import { NextRequest, NextResponse } from "next/server";
import db from "@/database/connection";

export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const res = await req.json();
    const {
      propertyID,
      propertyName,
      propertyAddress,
      changeType,
      changeDescriptionDetails,
      reasonForChange,
      desiredOutcome,
      requestorID,
      requestorName,
      requestorJobTitle,
      date,
      filename,
      mimetype,
      size,
      path,
    } = await res;

    const formData = await db.aPForm.create({
      data: {
        propertyID: propertyID,
        propertyName: propertyName,
        propertyAddress: propertyAddress,
        requestorID: requestorID,
        requestorName: requestorName,
        requestorJobTitle: requestorJobTitle,
        changeDescriptionDetails: changeDescriptionDetails,
        desiredOutcome: desiredOutcome,
        changeType: changeType,
        date: date,
        reasonForChange: reasonForChange,
      },
    });

    const APForm_id = formData.id;
    await db.uploads.create({
      data: {
        filename: filename,
        mimetype: mimetype,
        size: size,
        path: path,
        nsfas_form_id: APForm_id,
      },
    });

    return NextResponse.json(formData, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
