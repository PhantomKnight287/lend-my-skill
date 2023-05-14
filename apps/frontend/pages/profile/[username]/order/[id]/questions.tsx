import { Container } from "@components/container";
import { MetaTags } from "@components/meta";
import { outfit } from "@fonts";
import { readCookie } from "@helpers/cookie";
import { uploadFile } from "@helpers/upload";
import useHydrateUserContext from "@hooks/hydrate/user";
import useIssueNewAuthToken from "@hooks/jwt";
import {
  Button,
  FileInput,
  Group,
  LoadingOverlay,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  fetchChatQuestions,
  isChatQuestionsAnswered,
} from "@services/chats.service";
import { URLBuilder } from "@utils/url";
import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { ChatQuestions } from "./chat";

const QuestionsPage = () => {
  const [questionsAnswered, setQuestionsAnswered] = useState(false);
  const [questions, setQuestions] = useState<ChatQuestions[]>([]);

  useHydrateUserContext();
  useIssueNewAuthToken();

  const { isReady, query, replace, asPath } = useRouter();
  useEffect(() => {
    if (!isReady) return;
    const controller = new AbortController();
    const token = readCookie("token");
    if (!token)
      return void replace({
        pathname: "/auth/login",
        query: { to: asPath },
      });
    isChatQuestionsAnswered(
      query.chatId as string,
      token,
      (answered) => {
        if (answered === true)
          return void replace({
            pathname: `/profile/${query.username}/order/${query.id}/chat`,
          });
        setQuestionsAnswered(answered);
      },
      (err) => {
        showNotification({
          title: "Error",
          message:
            (err?.response?.data as any)?.message || "Something went wrong",
          color: "red",
        });
      },
      controller.signal
    );
    return () => controller.abort();
  }, [isReady, query.id]);

  useEffect(() => {
    if (questionsAnswered) return;
    const token = readCookie("token");
    if (!token) return;
    const controller = new AbortController();
    fetchChatQuestions(
      query.chatId as string,
      token,
      setQuestions,
      (err) => {
        showNotification({
          title: "Error",
          message:
            (err?.response?.data as any)?.message || "Something went wrong",
          color: "red",
        });
      },
      controller.signal
    );
  }, [questionsAnswered]);
  const formState = useForm({
    initialValues: {},
  });

  const { colorScheme } = useMantineColorScheme();

  const [loading, setLoading] = useState(false);

  return (
    <Container>
      <MetaTags title="Questions" description="Questions" />
      <LoadingOverlay visible={questions.length === 0} />
      <form
        onSubmit={formState.onSubmit(async (vals: any) => {
          setLoading(true);
          const answers: {
            id: string;
            answer: string;
            isAttachment: boolean;
            question?: string;
          }[] = [];
          for (const key in vals) {
            if (vals[key] instanceof File) {
              const data = await uploadFile(
                vals[key],
                readCookie("token")!
              ).catch((err) => {
                setLoading(false);
                showNotification({
                  title: "Error",
                  message:
                    (err?.response?.data as any)?.message ||
                    "Something went wrong",
                  color: "red",
                });
                return null;
              });
              if (data === null) return;
              const url = data.data.path;
              answers.push({
                answer: url,
                id: key,
                isAttachment: true,
                question: questions.find((q) => q.id === key)?.question,
              });
            } else {
              answers.push({
                answer: vals[key],
                id: key,
                isAttachment: false,
                question: questions.find((q) => q.id === key)?.question,
              });
            }
          }
          axios
            .post(
              URLBuilder(`/questions/${query.id}/answer`),
              { answers },
              {
                headers: {
                  authorization: `Bearer ${readCookie("token")!}`,
                },
              }
            )
            .then((d) => d.data)
            .then(() => {
              replace({
                pathname: `/profile/${query.username}/order/${query.id}/chat`,
              });
            })
            .catch((d) => {
              showNotification({
                title: "Error",
                message: d?.response?.data?.message || "Something went wrong",
                color: "red",
              });
            })
            .finally(() => {
              setLoading(false);
            });
        })}
      >
        {questions.map((ques) => (
          <Fragment key={ques.id}>
            {ques.answerType === "TEXT" ? (
              <TextInput
                label={ques.question}
                required={ques.isRequired}
                {...formState.getInputProps(ques.id)}
                value={(formState.values as any)[ques.id] || ""}
              />
            ) : (
              <FileInput
                label={ques.question}
                required={ques.isRequired}
                {...formState.getInputProps(ques.id)}
                value={(formState.values as any)[ques.id] || ""}
              />
            )}
          </Fragment>
        ))}
        <Group mt="xl" position="center">
          <Button
            type="submit"
            color="black"
            loading={loading}
            className={clsx("", {
              [outfit.className]: true,
              "bg-gray-900 hover:bg-black": colorScheme === "light",
              "bg-gradient-to-r from-[#3b82f6] to-[#2dd4bf] text-white":
                colorScheme === "dark",
            })}
          >
            Submit
          </Button>
        </Group>
      </form>
    </Container>
  );
};

export default QuestionsPage;
