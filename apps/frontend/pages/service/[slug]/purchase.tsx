import { Container } from "@components/container";
import { MetaTags } from "@components/meta";
import { outfit } from "@fonts";
import useHydrateUserContext from "@hooks/hydrate/user";
import { Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { axios } from "@utils/axios";
import { isCancel } from "axios";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Package = {
  deliveryDays: number;
  description: string;
  price: number;
  features: { name: string; id: string }[];
  id: string;
  name: string;
  service: {
    title: string;
  };
};

function Purchase() {
  const [_package, setPackage] = useState<Package>({} as Package);
  const { isReady, query, replace, asPath } = useRouter();
  useHydrateUserContext();
  useEffect(() => {
    if (isReady && !query.packageId) {
      return void replace(asPath.replace("/purchase", ""));
    }
    if (!isReady) return;
    const controller = new AbortController();
    axios
      .get(`/package/${query.packageId}`, { signal: controller.signal })
      .then(({ data }) => {
        setPackage(data);
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
  }, [isReady, query.packageId]);

  if (!isReady) return null;
  if (!_package.id) return null;
  return (
    <Container
      className={clsx("mb-10", {
        [outfit.className]: true,
      })}
    >
      <MetaTags description="Purchase a service" title="Purchase a Service" />
      <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-auto">
        <h3 className="text-2xl font-bold mb-4">{_package.name}</h3>
        <h4 className="text-lg font-medium mb-4">{_package.service.title}</h4>
        <p className="text-gray-400 mb-4">{_package.description}</p>
        <ul className="text-gray-400 mb-4">
          {_package.features.map((feature) => (
            <li key={feature.id}>{feature.name}</li>
          ))}
        </ul>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold">{`$${_package.price}`}</p>
          <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
            Buy Now
          </button>
        </div>
      </div>
    </Container>
  );
}

export default Purchase;
