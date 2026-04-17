export interface BkashConfig {
  app_key: string;
  app_secret: string;
  username: string;
  password: string;
  is_sandbox: boolean;
}

export interface BkashTokenResponse {
  id_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface BkashCreatePaymentResponse {
  paymentID: string;
  bkashURL: string;
  callbackURL: string;
  success: boolean;
  statusMessage: string;
}

export interface BkashExecuteResponse {
  paymentID: string;
  trxID: string;
  amount: string;
  transactionStatus: string; // 'Completed'
  customerMsisdn: string;
}