-- CreateTable
CREATE TABLE "Uploads" (
    "id" UUID NOT NULL,
    "filename" TEXT,
    "path" TEXT,
    "mimetype" TEXT,
    "size" INTEGER,
    "nsfas_form_id" UUID,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "APForm" (
    "id" UUID NOT NULL,
    "propertyID" TEXT,
    "propertyName" TEXT,
    "propertyAddress" TEXT,
    "changeType" TEXT,
    "changeDescriptionDetails" TEXT,
    "reasonForChange" TEXT,
    "desiredOutcome" TEXT,
    "requestorName" TEXT,
    "requestorID" TEXT,
    "requestorJobTitle" TEXT,
    "date" TIMESTAMP(3),
    "priority" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "APForm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Uploads" ADD CONSTRAINT "Uploads_nsfas_form_id_fkey" FOREIGN KEY ("nsfas_form_id") REFERENCES "APForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
