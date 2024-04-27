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
import { format } from "date-fns";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FaCalendar } from "react-icons/fa";

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
		id: "Other Change",
		label: "Other Change",
	},
] as const;

const priority = [
	{
		id: "Urgent",
		label: "Urgent",
	},
	{
		id: "Routine",
		label: "Routine",
	},
	{
		id: "Critical",
		label: "Critical",
	},
] as const;

const formSchema = z.object({
	propertyID: z.string().min(5, {
		message: "Property ID must have at least 5 characters",
	}),
	propertyName: z.string().min(5, {
		message: "Property Name must have at least 5 characters",
	}),
	propertyAddress: z.string().min(5, {
		message: "Property Address must have at least 5 characters",
	}),
	changeType: z
		.array(z.string())
		.refine((value) => value.some((item) => item), {
			message: "You have to select one item.",
		}),
	priority: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: "You have to select one item.",
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
	requestorName: z.string().min(5, {
		message: "Requestor Name must have at least 5 characters",
	}),
	requestorID: z.string().min(5, {
		message: "Requestor ID must have at least 5 characters",
	}),
	requestorJobTitle: z.string().min(5, {
		message: "Requestor Job Title must have at least 5 characters",
	}),

	date: z.date({
		required_error: "A date is required.",
	}),
});

export default function MultiFileDropzoneUsage() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			propertyID: "",
			propertyName: "",
			propertyAddress: "",
			changeDescriptionDetails: "",
			desiredOutcome: "",
			requestorName: "",
			requestorID: "",
			requestorJobTitle: "",

			changeType: [],
			priority: [],
		},
	});
	const [img_url, setUrl] = useState("");
	const router = useRouter();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const fileData = fileStates[0].file;
		const filePath = img_url;

		const res = await axios.post("api/apform", {
			propertyID: values.propertyID,
			propertyName: values.propertyName,
			propertyAddress: values.propertyAddress,
			changeDescriptionDetails: values.changeDescriptionDetails,
			reasonForChange: values.reasonForRequiredChange,
			desiredOutcome: values.desiredOutcome,
			requestorID: values.requestorID,
			requestorName: values.requestorName,
			requestorJobTitle: values.requestorJobTitle,
			date: values.date,
			priority: values.priority,
			changeType: values.changeType,
			filename: fileData.name,
			mimetype: fileData.type,
			size: fileData.size,
			path: filePath,
		});

		if (res.status === 201) {
			router.push("/success");
		}
	}

	const [fileStates, setFileStates] = useState<FileState[]>([]);
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

	return (
		<>
			<h1 className="mt-8 text-4xl">Change Request Form</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="date"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Date</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button variant={"outline"} className="rounded-xl">
												{field.value ? (
													format(field.value, "PPP")
												) : (
													<span>Pick a date</span>
												)}
												<FaCalendar className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date: Date) => date < new Date()}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="propertyID"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Property ID</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter your property ID"
										{...field}
										className="rounded-xl"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
										className="rounded-xl"
									/>
								</FormControl>
								<FormMessage />
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
									<Input
										placeholder="Enter property address"
										{...field}
										className="rounded-xl"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="requestorID"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Requestor's ID</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter your ID"
										{...field}
										className="rounded-xl"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="requestorName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Requestor's Name</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter your name"
										{...field}
										className="rounded-xl"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="requestorJobTitle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Requestor's Job Title(Role at the Property)
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter your Job Title"
										{...field}
										className="rounded-xl"
									/>
								</FormControl>
								<FormMessage />
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
																	? field.onChange([...field.value, item.id])
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

								<FormMessage />
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
										className="resize-none rounded-xl"
										{...field}
									/>
								</FormControl>

								<FormMessage />
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
										className="resize-none rounded-xl"
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="desiredOutcome"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Desired Outcome of Change(by Property Owner or Requestor
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Describe your desired outcome"
										className="resize-none rounded-xl"
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="priority"
						render={() => (
							<FormItem>
								<div className="mb-4">
									<FormLabel className="text-base">Priority:</FormLabel>
								</div>
								{priority.map((item) => (
									<FormField
										key={item.id}
										control={form.control}
										name="priority"
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
																	? field.onChange([...field.value, item.id])
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

								<FormMessage />
							</FormItem>
						)}
					/>

					<h1>
						NOTE: For Property Ownership attach certified copy of new title
						deed, previous property owner written confirmation for reason of
						ownership change, and for bank changes, attach bank confirmation
						letter, title deed with holder name matching the account name and/or
						property owner confirmation (affidavit) of reason why account name
						is different. User system account name change, property owner’s
						confirmation (affidavit) of change.
					</h1>

					<Button
						type="submit"
						variant={"outline"}
						className="rounded-xl w-full"
					>
						Submit
					</Button>
				</form>
			</Form>
			<div className="mb-[10rem]">
				<MultiFileDropzone
					className="bg-white"
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
		</>
	);
}
