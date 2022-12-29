import { Container } from "@components/container";
import { outfit } from "@fonts";
import clsx from "clsx";
import React from "react";

const Orders = () => {
    return (
        <>
            <Container
                className={clsx("", {
                    [outfit.className]: true,
                })}
            >
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos repellat dolore, beatae ipsum reiciendis molestias voluptatibus itaque iste nostrum reprehenderit.
            </Container>
        </>
    );
};

export default Orders;
