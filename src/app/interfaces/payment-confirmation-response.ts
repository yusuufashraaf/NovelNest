interface PaymentConfirmationResponse {
  success: boolean;
  message?: string;
  data?: {
    orderId: string;
    captureId: string;
    status: string;
  };
}
