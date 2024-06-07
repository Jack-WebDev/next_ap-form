"use client";

import React, { useState } from 'react';
import axios from "axios";

interface FormValues {
    propertyID: string;
    propertyName: string;
    propertyAddress: string;
    changeType: string[];
    changeDescriptionDetails: string;
    reasonForRequiredChange: string;
    desiredOutcome: string;
    requestorName: string;
    requestorID: string;
    requestorJobTitle: string;
    date: string;
}
import {
  MultiFileDropzone,
  type FileState,
} from "@/app/components/MultiFileDropzone";
import { useEdgeStore } from "@/lib/edgestore";

import { useRouter } from 'next/navigation';

const changeType = [
  { id: "Bank Details Change", label: "Bank Details Change" },
  { id: "Property Ownership Change", label: "Property Ownership Change" },
  { id: "User Account Name Change", label: "User Account Name Change" },
  { id: "ID Change", label: "ID Change" },
  { id: "Other Change", label: "Other Change" },
] as const;

const FormComponent: React.FC = () => {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [img_url, setUrl] = useState("");
  const router = useRouter();

  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

    const [formValues, setFormValues] = useState<FormValues>({
        propertyID: '',
        propertyName: '',
        propertyAddress: '',
        changeType: [],
        changeDescriptionDetails: '',
        reasonForRequiredChange: '',
        desiredOutcome: '',
        requestorName: '',
        requestorID: '',
        requestorJobTitle: '',
        date: '',
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.target;
      if (name === 'changeType' && type === 'checkbox') {
          setFormValues((prevValues) => {
              const newChangeType = checked
                  ? [...prevValues.changeType, value]
                  : prevValues.changeType.filter((type) => type !== value);
              return { ...prevValues, changeType: newChangeType };
          });
      } else {
          setFormValues({
              ...formValues,
              [name]: value,
          });
      }
  };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fileData = fileStates[0].file;
        const filePath = img_url;
    
        const res = await axios.post("api/apform", {
          propertyID: formValues.propertyID,
          propertyName: formValues.propertyName,
          propertyAddress: formValues.propertyAddress,
          changeDescriptionDetails: formValues.changeDescriptionDetails,
          reasonForChange: formValues.reasonForRequiredChange,
          desiredOutcome: formValues.desiredOutcome,
          requestorID: formValues.requestorID,
          requestorName: formValues.requestorName,
          requestorJobTitle: formValues.requestorJobTitle,
          date: formValues.date,
          changeType: formValues.changeType,
          filename: fileData.name,
          mimetype: fileData.type,
          size: fileData.size,
          path: filePath,
        });
    
        if (res.status === 201) {
          router.push("/success");
        }
        console.log(formValues)
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 rounded-lg">
                <h1 className="mb-8 text-center text-4xl">Change Request Form</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-black">Property ID</label>
                    <input
                        type="text"
                        name="propertyID"
                        value={formValues.propertyID}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-xl"
                    />
                </div>
                <div>
                    <label className="block text-black">Property Name</label>
                    <input
                        type="text"
                        name="propertyName"
                        value={formValues.propertyName}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-xl"
                    />
                </div>
                <div>
                    <label className="block text-black">Property Address</label>
                    <input
                        type="text"
                        name="propertyAddress"
                        value={formValues.propertyAddress}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-xl"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Change Type</label>
                    <div className="mt-1 grid grid-cols-1">
                        {changeType.map((type) => (
                            <label key={type.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="changeType"
                                    value={type.id}
                                    checked={formValues.changeType.includes(type.id)}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                {type.label}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-black">Change Description Details</label>
                    <textarea
                        name="changeDescriptionDetails"
                        value={formValues.changeDescriptionDetails}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-xl"
                    ></textarea>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-black">Reason For Required Change</label>
                    <textarea
                        name="reasonForRequiredChange"
                        value={formValues.reasonForRequiredChange}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-xl"
                    ></textarea>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-black">Desired Outcome</label>
                    <textarea
                        name="desiredOutcome"
                        value={formValues.desiredOutcome}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-xl"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-black">Requestor Name</label>
                    <input
                        type="text"
                        name="requestorName"
                        value={formValues.requestorName}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-xl"
                    />
                </div>
                <div>
                    <label className="block text-black">Requestor ID</label>
                    <input
                        type="text"
                        name="requestorID"
                        value={formValues.requestorID}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-xl"
                    />
                </div>
                <div>
                    <label className="block text-black">Requestor Job Title</label>
                    <input
                        type="text"
                        name="requestorJobTitle"
                        value={formValues.requestorJobTitle}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-xl text-black"
                    />
                </div>
                <div>
                    <label className="block text-black">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formValues.date}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-xl text-black"
                    />
                </div>
            </div>
            <h2 className='my-4 text-xl'>
            NOTE: For Property Ownership attach certified copy of new title
            deed, previous property owner written confirmation for reason of
            ownership change or the confirmation letter from property transfer
            attorney,, and for bank changes, attach bank confirmation letter,
            title deed with holder name matching the account name and/or
            property owner confirmation (affidavit) of reason why account name
            is different. User system account name change, property owner’s
            confirmation (affidavit) of change. If property name is the same as
            bank account name then provide CIPC docs as proof of
            directorship/shareholder status of the property and shareholder’s/
            director’s consent letter as confirmation for account name.
          </h2>
          <div className="mb-[10rem]">
        <MultiFileDropzone
          className="bg-white relative left-[10rem]"
          name="files"
          value={fileStates}
          onChange={(files) => {
            setFileStates(files);
          }}
          onFilesAdded={async (addedFiles) => {
            setFileStates([...fileStates, ...addedFiles]);
            await Promise.all(
              addedFiles.map(async (addedFileState) => {
                try {
                  const res = await edgestore.publicFiles.upload({
                    file: addedFileState.file,
                    onProgressChange: async (progress) => {
                      updateFileProgress(addedFileState.key, progress);
                      if (progress === 100) {
                        await new Promise((resolve) =>
                          setTimeout(resolve, 1000)
                        );
                        updateFileProgress(addedFileState.key, "COMPLETE");
                      }
                    },
                  });
                  setUrl(res.url);
                  console.log(res);
                } catch (err) {
                  updateFileProgress(addedFileState.key, "ERROR");
                }
              })
            );
          }}
        />
      </div>
            <button type="submit" className="w-full py-2 px-4 mt-6 text-white rounded-xl border border-white">
                Submit
            </button>
        </form>
    );
};

export default FormComponent;
