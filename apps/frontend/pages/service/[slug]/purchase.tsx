/* eslint-disable react/no-children-prop */
import { Container } from "@components/container";
import Editor from "@components/editor";
import { MetaTags } from "@components/meta";
import { Renderer } from "@components/renderer";
import { outfit, satoshi } from "@fonts";
import { readCookie } from "@helpers/cookie";
import useHydrateUserContext from "@hooks/hydrate/user";
import { Button, Image, LoadingOverlay, TextInput } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { axios } from "@utils/axios";
import { assetURLBuilder } from "@utils/url";
import { isCancel } from "axios";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { Service } from "~/types/service";
import useRazorpay from "react-razorpay";

function Purchase() {
  const [service, setService] = useState<Service>({} as Service);
  const { isReady, query, replace, asPath } = useRouter();
  const [selected, setSelected] = useState<string>(
    (query.packageId as string) || ""
  );
  useHydrateUserContext("replace", true, undefined, true);
  const [coupon, setCoupon] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const Razorpay = useRazorpay();
  useEffect(() => {
    if (!isReady) return;
    const controller = new AbortController();
    axios
      .get(`/services/${query.slug}`, { signal: controller.signal })
      .then(({ data }) => {
        setService(data);
      })
      .catch((err) => {
        if (isCancel(err)) return;
        console.log(err);
        showNotification({
          message: "Something went wrong",
          color: "red",
          autoClose: 5000,
        });
      });

    return () => controller.abort();
  }, [isReady]);
  const onSubmit = async () => {
    setLoading(true);
    const token = readCookie("token");
    axios
      .post(
        `/purchase`,
        {
          packageId: selected,
          couponCode: coupon,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(({ data }: { data: { orderId: string; amount: number } }) => {
        const r = new Razorpay({
          amount: String(Math.round(data.amount * 100)),
          currency: "INR",
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
          name: "Lend My Skill",
          order_id: data.orderId,
          handler: console.log,
        });
        r.on("payment.failed", console.log);
        r.open();
      })
      .catch((err) => {
        showNotification({
          message:
            (Array.isArray(err.response.data.message)
              ? err.response.data.message[0]
              : err.response.data.message) || "Something went wrong",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!isReady) return null;
  if (!service.id) return null;
  return (
    <div
      className={clsx(
        "flex flex-col lg:flex-row lg:flex-wrap px-8 pb-6 pt-3 justify-around",
        {
          [outfit.className]: true,
        }
      )}
    >
      <LoadingOverlay visible={loading} />
      <MetaTags
        title={`@${service.user.username} | ${service.user.name} | Lend My Skill`}
        description={
          service.description || `${service.user.name} on Lend My Skill`
        }
        ogImage={assetURLBuilder(service.images[0])}
      />
      <Container className="lg:flex-[0.5] mt-8">
        <h1
          className={clsx(
            "text-2xl font-bold break-words hyphens-auto",
            satoshi.className
          )}
          lang="en"
        >
          {service.title}
        </h1>

        <div className="items-center justify-center mt-8 hidden lg:flex">
          {service.images.length > 0 ? (
            <div className="container max-w-[400px] h-fit">
              <Carousel
                autoPlay={false}
                interval={5000}
                infiniteLoop
                showThumbs={false}
              >
                {service.images.map((i) => (
                  <div
                    key={assetURLBuilder(i)}
                    className="max-w-[400px] aspect-square  "
                  >
                    {i.endsWith(".mp4") ? (
                      <video
                        src={assetURLBuilder(i)}
                        className="cursor-pointer my-6"
                        controls
                        onClick={() => {
                          window.open(assetURLBuilder(i));
                        }}
                      />
                    ) : (
                      <Image
                        src={assetURLBuilder(i)}
                        alt="Image"
                        className="cursor-pointer  max-w-[400px] aspect-square"
                        classNames={{
                          image: "rounded-md max-w-[400px] aspect-square",
                        }}
                        onClick={() => {
                          window.open(assetURLBuilder(i));
                        }}
                      />
                    )}
                  </div>
                ))}
              </Carousel>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col items-center gap-2 mt-8">
          {service.package?.map((p) => (
            <div key={p.id} className="bg-secondary/30 p-2 rounded-md w-full">
              <div className="flex flex-row gap-2 ">
                <input
                  type="radio"
                  name="package"
                  id={p.id}
                  value={p.id}
                  onChange={() => setSelected(p.id)}
                  checked={selected === p.id}
                />
                <label htmlFor={p.id} className="flex flex-row gap-2 w-full">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-row items-center justify-between">
                      <h1 className="text-xl font-bold">
                        {upperFirst(p.name)}
                      </h1>
                      <h1 className="text-xl font-bold">${p.price}</h1>
                    </div>
                  </div>
                </label>
              </div>
              <p
                className={clsx("ml-5", {
                  hidden: selected !== p.id,
                })}
              >
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
      <div className="mt-8 flex-1 lg:sticky top-10 lg:flex-[0.4] h-screen bg-[#ffffff]">
        <h1 className="text-2xl font-bold">Payment Details</h1>
        <p
          className={clsx("mt-2", {
            hidden: !selected,
          })}
        >
          You will be paying $
          {service.package?.find((p) => p.id === selected)?.price || 0} to{" "}
          {service.user.name}
        </p>
        <TextInput
          disabled
          label="Package Selected"
          required
          value={service.package?.find((p) => p.id === selected)?.name || ""}
          classNames={{
            input: "text-black",
          }}
        />
        <TextInput
          mt="lg"
          required
          disabled
          label="Amount"
          value={`$${
            service.package?.find((p) => p.id === selected)?.price || 0
          }`}
        />
        <TextInput
          mt="lg"
          required={false}
          label="Coupon Code"
          placeholder="Enter Coupon Code"
          value={coupon}
          onChange={(e) => setCoupon(e.currentTarget.value)}
        />
        <div className="flex">
          <Button
            color="green"
            variant="light"
            className="mt-4 mx-auto"
            disabled={!selected}
            onClick={onSubmit}
          >
            Purchase
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Purchase;
