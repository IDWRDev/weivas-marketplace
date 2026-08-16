CREATE TYPE "PaymentStatus" AS ENUM ('initialized', 'pending', 'succeeded', 'failed', 'refunded', 'manual_review');

CREATE TABLE "Payment" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "checkoutKey" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerReference" TEXT NOT NULL,
  "providerTransactionId" TEXT,
  "authorizationUrl" TEXT,
  "accessCode" TEXT,
  "amountMinor" INTEGER NOT NULL,
  "currency" TEXT NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'initialized',
  "providerStatus" TEXT,
  "failureReason" TEXT,
  "paidAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentWebhookEvent" (
  "id" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "eventKey" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "payloadHash" TEXT NOT NULL,
  "processedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PaymentWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");
CREATE UNIQUE INDEX "Payment_checkoutKey_key" ON "Payment"("checkoutKey");
CREATE UNIQUE INDEX "Payment_providerReference_key" ON "Payment"("providerReference");
CREATE UNIQUE INDEX "Payment_providerTransactionId_key" ON "Payment"("providerTransactionId");
CREATE INDEX "Payment_status_createdAt_idx" ON "Payment"("status", "createdAt");
CREATE UNIQUE INDEX "PaymentWebhookEvent_eventKey_key" ON "PaymentWebhookEvent"("eventKey");
CREATE INDEX "PaymentWebhookEvent_provider_createdAt_idx" ON "PaymentWebhookEvent"("provider", "createdAt");
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
