"use client";

import { useRouter } from "next/navigation";
import {
  MultiFileDropzone,
  type FileState,
} from "@/app/components/MultiFileDropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";


import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loading from "./loading";
import { toast } from "react-toastify";
const changeType = [
  {
    id: "Bank Details Change",
    label: "Bank Details Change",
  },
  {
    id: "Property Ownership Change",
    label: "Property Ownership Change",
  },
  {
    id: "User Account Name Change",
    label: "User Account Name Change",
  },
  {
    id: "ID Change",
    label: "ID Change",
  },
  {
    id: "Other Change",
    label: "Other Change",
  },
] as const;

const formSchema = z.object({
  propertyName: z.string().min(1, {
    message: "Property Name must have 1 or more characters",
  }),
  propertyAddress: z.string().min(1, {
    message: "Property Address must have 1 or more character",
  }),
  changeType: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),

  changeDescriptionDetails: z.string().min(5, {
    message: "Change Description Details must have at least 5 characters",
  }),
  reasonForRequiredChange: z.string().min(5, {
    message: "Reason for change must have at least 5 characters",
  }),
  desiredOutcome: z.string().min(5, {
    message: "Desired Outcome must have at least 5 characters",
  }),
  requestorName: z.string().min(1, {
    message: "Your Name must have 1 or more characters",
  }),
  requestorSurname: z.string().min(1, {
    message: "Your Surname must have 1 or more characters",
  }),
  requestorID: z
    .string()
    .min(13, { message: "Please enter a valid ID Number" })
    .max(13, { message: "Please enter a valid ID Number" }),
  requestorJobTitle: z.string().min(1, {
    message: "Your Job Title must have 1 or more characters",
  }),
});

export default function MultiFileDropzoneUsage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyName: "",
      propertyAddress: "",
      changeDescriptionDetails: "",
      desiredOutcome: "",
      reasonForRequiredChange: "",
      requestorName: "",
      requestorSurname: "",
      requestorID: "",
      requestorJobTitle: "",

      changeType: [],
    },
  });
  const [img_url, setUrl] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();
  const router = useRouter();

  const validateUploads = () => {
    let isValid = true;

    if (fileStates.length === 0) {
      toast.error("Please attach the required documentation");
      isValid = false;
    }

    return isValid;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const fileData = fileStates.map((fileState) => fileState.file);
    const filePath = img_url;

    if(!validateUploads()) return;

    try {
      setLoading(true);
      const res = await axios.post("api/apform", {
        propertyName: values.propertyName,
        propertyAddress: values.propertyAddress,
        changeDescriptionDetails: values.changeDescriptionDetails,
        reasonForChange: values.reasonForRequiredChange,
        desiredOutcome: values.desiredOutcome,
        requestorID: values.requestorID,
        requestorName: values.requestorName,
        requestorSurname: values.requestorSurname,
        requestorJobTitle: values.requestorJobTitle,
        changeType: values.changeType,
        filename: fileData.map((file) => file.name),
        mimetype: fileData.map((file) => file.type),
        size: fileData.map((file) => file.size),
        path: filePath,
      });

      if (res.status === 201) {
        setLoading(false);
        router.push("/success");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }



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

  return (
    <div>
      {loading && <Loading />}
      <Form {...form}>
        <div className="mx-8 mt-8 bg-white rounded-xl py-4 md:mx-auto">
          <h1 className="mt-8 text-2xl font-medium text-center text-black">
            NSFAS Change Request Form
          </h1>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-3xl mx-auto p-4 rounded-lg md:px-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="propertyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your property Name"
                        {...field}
                        className="mt-1 p-2 w-full border rounded-xl bg-white text-black placeholder:text-gray-600"
                      />
                    </FormControl>
                    <FormMessage style={{ color: "red" }} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter property address"
                        {...field}
                        className="mt-1 p-2 w-full border rounded-xl bg-white text-black placeholder:text-gray-600"
                      />
                    </FormControl>
                    <FormMessage style={{ color: "red" }} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requestorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        className="mt-1 p-2 w-full border rounded-xl bg-white text-black placeholder:text-gray-600"
                      />
                    </FormControl>
                    <FormMessage style={{ color: "red" }} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requestorSurname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surname</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your surname"
                        {...field}
                        className="mt-1 p-2 w-full border rounded-xl bg-white text-black placeholder:text-gray-600"
                      />
                    </FormControl>
                    <FormMessage style={{ color: "red" }} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requestorID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your ID Number"
                        {...field}
                        className="mt-1 p-2 w-full border rounded-xl bg-white text-black placeholder:text-gray-600"
                      />
                    </FormControl>
                    <FormMessage style={{ color: "red" }} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requestorJobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title (Role at the Property)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Job Title"
                        {...field}
                        className="mt-1 p-2 w-full border rounded-xl bg-white text-black placeholder:text-gray-600"
                      />
                    </FormControl>
                    <FormMessage style={{ color: "red" }} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="changeType"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Tick the Change Type Required:
                      </FormLabel>
                    </div>
                    {changeType.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="changeType"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}

                    <FormMessage style={{ color: "red" }} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="changeDescriptionDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Change Description Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the changes required"
                        className="resize-none mt-1 p-2 w-full border rounded-xl bg-white text-black placeholder:text-gray-600"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage style={{ color: "red" }} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reasonForRequiredChange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason For Required Change</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the reason for the change"
                        className="resize-none mt-1 p-2 w-full border rounded-xl bg-white text-black placeholder:text-gray-600"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage style={{ color: "red" }} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desiredOutcome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Desired Outcome of Change(by Property Owner or Requestor)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your desired outcome"
                        className="resize-none mt-1 p-2 w-full border rounded-xl bg-white text-black placeholder:text-gray-600"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage style={{ color: "red" }} />
                  </FormItem>
                )}
              />
            </div>

            <h1 className="my-12 text-black">
              NOTE:{" "}
              <span className="font-semibold">For Property Ownership</span>{" "}
              attach certified copy of new title deed, or  previous property owner
              written affidavit confirmation for reason of ownership change and confirm that propety ownership was perfomed withput any chnagt of any previsloiry inspexte propety diytens  or the
              confirmation letter from property transfer attorney, and{" "}
              <span className="font-semibold">for bank changes</span>, attach
              bank confirmation letter, title deed with holder name matching the
              account name and/or property owner confirmation (affidavit) of
              reason why account name is different.{" "}
              <span className="font-semibold">
                User system account name change
              </span>
              , property owner’s confirmation (affidavit) of change.{" "}
              <span className="font-semibold">
                If property name is the same as bank account name then provide
                CIPC docs as proof of directorship/shareholder status of the
                property and shareholder’s/ director’s consent letter as
                confirmation for account name.
              </span>
            </h1>

            <div className="mb-[5rem]">
              <MultiFileDropzone
                className="bg-white w-full"
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
                              updateFileProgress(
                                addedFileState.key,
                                "COMPLETE"
                              );
                            }
                          },
                        });
                        setUrl((urls) => [...urls, res.url]);
                        console.log(res);
                      } catch (err) {
                        updateFileProgress(addedFileState.key, "ERROR");
                      }
                    })
                  );
                }}
              />
            </div>

            <Button
              type="submit"
              variant={"outline"}
              className="rounded-xl py-6 w-full bg-[#a1261f] text-white text-xl"
            >
              Submit
            </Button>
          </form>
        </div>
      </Form>
    </div>
  );
}
