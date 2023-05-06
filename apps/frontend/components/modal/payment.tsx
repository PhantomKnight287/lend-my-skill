import { Modal, ModalProps } from "@mantine/core";

export interface PaymentModalProps extends ModalProps {
  sellerUsername: string;
  packageId: string;
}
const PaymentModal = ({
  sellerUsername,
  packageId,
  ...props
}: PaymentModalProps) => {
  return (
    <Modal {...props}>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Payment</h1>
        <h2 className="text-lg font-semibold">Seller: {sellerUsername}</h2>
        <h2 className="text-lg font-semibold">Package: {packageId}</h2>
      </div>
    </Modal>
  );
};

export default PaymentModal;
