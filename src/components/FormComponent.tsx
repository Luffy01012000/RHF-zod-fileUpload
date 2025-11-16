import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { useFieldArray } from "react-hook-form";
import { UploadIcon, X } from "lucide-react";
import { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Field,
  FieldContent,
  // FieldDescription,
  FieldLabel,
  FieldTitle,
} from "./ui/field";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useDropzone } from "react-dropzone";
import { UploadProgressCard } from "./UploadProgressCard";
import { useFileManagerStore } from "@/hooks/useFileManagerStore";
import { useFileUploadMutation } from "@/hooks/useFileUploadMutation";
import { FilesDataGrid } from "./FilesDataGrid";

const workExperienceSchema = z.discriminatedUnion("hasWorkExperience", [
  z.object({
    hasWorkExperience: z.literal(true),
    companyName: z.string().min(1),
  }),
  z.object({ hasWorkExperience: z.literal(false) }),
]);

const educationSchema = z.discriminatedUnion("educationLevel", [
  z.object({
    educationLevel: z.literal("noFormalEducation"),
  }),
  z.object({
    educationLevel: z.literal("highSchoolDiploma"),
    schoolName: z.string().min(1),
  }),
  z.object({
    educationLevel: z.literal("bachelorsDegree"),
    universityName: z.string().min(1),
  }),
]);

const languageKnowledgeSchema = z.discriminatedUnion("knowsOtherLanguages", [
  z.object({
    knowsOtherLanguages: z.literal(true),
    languages: z
      .array(
        z.object({
          name: z.string().min(1),
        })
      )
      .min(1),
  }),
  z.object({ knowsOtherLanguages: z.literal(false) }),
]);

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    language: z
      .string()
      .min(1, "Please select your spoken language.")
      .refine((val) => val !== "auto", {
        message:
          "Auto-detection is not allowed. Please select a specific language.",
      }),
    documents: z.union([
      z.instanceof(File, { message: "Document is required" }),
      z.string().optional(), // Allow the existing image URL for editing mode
    ])
    .refine((value) => value instanceof File || typeof value === "string", {
      message: "Document is required",
    }), 
  })
  .and(workExperienceSchema)
  .and(educationSchema)
  .and(languageKnowledgeSchema);

const spokenLanguages = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Italian", value: "it" },
  { label: "Chinese", value: "zh" },
  { label: "Japanese", value: "ja" },
] as const;

const educationLevels = [
  {
    id: "1",
    label: "No Formal Education",
    value: "noFormalEducation",
    title: "No Formal Education",
  },
  {
    id: "2",
    label: "High School Diploma",
    value: "highSchoolDiploma",
    title: "High School Diploma",
  },
  {
    id: "3",
    label: "Bachelors Degree",
    value: "bachelorsDegree",
    title: "Bachelors Degree",
  },
] as const;

type TFormProps = {
  initialData?: TSchemaVal & { id: string };
};
type TSchemaVal = z.infer<typeof formSchema>;

const transformData = (
  data: TSchemaVal & { id: string }
): TSchemaVal | undefined => {
  if (!data) return undefined;

  const base = {
    username: data.username ?? "",
    language: data.language ?? "",
  };

  // Work Experience Branch
  const work =
    data.hasWorkExperience === true
      ? {
          hasWorkExperience: true as const,
          companyName: data.companyName ?? "",
        }
      : {
          hasWorkExperience: false as const,
        };

  // Education Branch
  const education =
    data.educationLevel === "highSchoolDiploma"
      ? {
          educationLevel: "highSchoolDiploma" as const,
          schoolName: data.schoolName ?? "",
        }
      : data.educationLevel === "bachelorsDegree"
        ? {
            educationLevel: "bachelorsDegree" as const,
            universityName: data.universityName ?? "",
          }
        : {
            educationLevel: "noFormalEducation" as const,
          };

  // Language Knowledge Branch
  const lang =
    data.knowsOtherLanguages === true
      ? {
          knowsOtherLanguages: true as const,
          languages: data.languages ?? [{ name: "" }],
        }
      : {
          knowsOtherLanguages: false as const,
        };

  return {
    ...base,
    ...work,
    ...education,
    ...lang,
  };
};

const FormComponent = ({ initialData }: TFormProps) => {
  console.log("initialData:", initialData);
  const files = useFileManagerStore((state) => state.files);
  const [autoAnimateRef] = useAutoAnimate();
// useEffect(()=>{
  // console.log("files:",files)
// },[files])
  const fileUploadMutation = useFileUploadMutation();
  
  function onDrop(acceptedFiles: File[]) {
    fileUploadMutation.mutate(
      acceptedFiles.map((item) => ({
        file: item,
        id: `${item.name}${item.size}`,
        uploadProgress: 0,
        uploadStatus: "idle",
      }))
    );
  }

  const { getRootProps, getInputProps } = useDropzone({
    // accept: {
    //   "image/*": [],
    //   "video/*": [],
    // },
    onDrop,
    maxFiles: 15,
    maxSize: 10_000_000_000,
  });

  const form = useForm<TSchemaVal>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? transformData(initialData)
      : {
          username: "",
          language: "",
          hasWorkExperience: false,
          knowsOtherLanguages: false,
          educationLevel: "noFormalEducation",
        },
  });

  const {
    fields: languagesFields,
    replace: replaceLanguages,
    append: appendLanguages,
    remove: removeLanguages,
  } = useFieldArray({
    control: form.control,
    name: "languages",
  });

  const knowsOtherLanguages = useWatch({
    control: form.control,
    name: "knowsOtherLanguages",
  });
  const educationLevel = useWatch({
    control: form.control,
    name: "educationLevel",
  });
    useEffect(()=>{
  console.log("educationLevel:",educationLevel)
  },[educationLevel])
  useEffect(() => {
    if (initialData?.knowsOtherLanguages && initialData?.languages && knowsOtherLanguages) {
      replaceLanguages(initialData?.languages?.length > 0 ? initialData.languages : [{ name: "" }]
);
    }else{
      replaceLanguages([{name:""}])
    }
  }, [knowsOtherLanguages, replaceLanguages, initialData]);
  const fullErrors: FieldErrors<
    Extract<TSchemaVal, { hasWorkExperience: true }>
  > &
    FieldErrors<Extract<TSchemaVal, { educationLevel: "noFormalEducation" }>> &
    FieldErrors<Extract<TSchemaVal, { educationLevel: "highSchoolDiploma" }>> &
    FieldErrors<Extract<TSchemaVal, { educationLevel: "bachelorsDegree" }>> &
    FieldErrors<Extract<TSchemaVal, { knowsOtherLanguages: true }>> =
    form.formState.errors;

  // 2. Define a submit handler.
  function onSubmit(values: TSchemaVal) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("onsubmit:", values);
  }
  useEffect(() => {
    console.log("form.formState:", form.formState.defaultValues);
  }, [form.formState.defaultValues]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Select
                  name={field.name}
                  // defaultValue={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="form-rhf-select-language"
                    aria-invalid={fieldState.invalid}
                    className="min-w-[120px]"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectSeparator />
                    {spokenLanguages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hasWorkExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Experience</FormLabel>
              <FormControl>
                <Checkbox
                  id="form-rhf-checkbox-responses"
                  name={field.name}
                  defaultChecked={field.value}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  // disabled
                />
              </FormControl>
              <FormDescription>This is your Work Experience.</FormDescription>
              {/* {form.watch("companyName") && <FormMessage />} */}
            </FormItem>
          )}
        />
        {form.watch("hasWorkExperience") && (
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="knowsOtherLanguages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages</FormLabel>
              <FormControl>
                <Checkbox
                  id="form-rhf-checkbox-responses"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  // disabled
                />
              </FormControl>
              <FormDescription>Checkbox.</FormDescription>
              {form.watch("knowsOtherLanguages") && <FormMessage />}
            </FormItem>
          )}
        />

        {form.watch("knowsOtherLanguages") && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="languages"
              render={() => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>

                  <FormControl>
                    <div className="space-y-3">
                      {languagesFields.map((item, index) => (
                        <div key={item.id} className="flex items-start gap-3">
                          {/* Input for languages[index].name */}
                          <div className="flex-1 space-y-1">
                            <Input
                              placeholder="Language name"
                              {...form.register(`languages.${index}.name`)}
                            />

                            {/* Error for languages[index].name */}
                            {fullErrors.languages?.[index]?.name && (
                              <p className="text-sm text-red-500">
                                {fullErrors.languages[index].name.message}
                              </p>
                            )}
                          </div>

                          {/* Remove language button */}
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeLanguages(index)}
                            disabled={languagesFields.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      {/* Add language button */}
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => appendLanguages({ name: "" })}
                      >
                        Add Language
                      </Button>
                    </div>
                  </FormControl>

                  {/* If languages array has a top-level error (e.g., ".min(1)") */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="educationLevel"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Education Level</FormLabel>
              <FormControl>
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {educationLevels.map((eduLevl) => (
                    <FieldLabel
                      key={eduLevl.id}
                      htmlFor={`form-rhf-radiogroup-${eduLevl.id}`}
                    >
                      <Field
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldTitle>{eduLevl.title}</FieldTitle>
                          {/* <FieldDescription>
                            {eduLevl.description}
                          </FieldDescription> */}
                        </FieldContent>
                        <RadioGroupItem
                          value={eduLevl.value}
                          id={`form-rhf-radiogroup-${eduLevl.id}`}
                          aria-invalid={fieldState.invalid}
                        />
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormDescription>Education Level.</FormDescription>
            </FormItem>
          )}
        />

        {educationLevel === "highSchoolDiploma" && (
          <FormField
            control={form.control}
            name="schoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                  {/* // <Input
          // {...form.register("schoolName")}
          // helperText={fullErrors.universityName?.message}
          // error={!!fullErrors.universityName?.message}
          // /> */}
                </FormControl>
                <FormDescription>
                  This is school level.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
       
        {educationLevel === "bachelorsDegree" && (
          <FormField
            control={form.control}
            name="universityName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                  
                </FormControl>
                <FormDescription>
                  This is school level.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField 
        control={form.control}
        name="documents"
        render={()=>(
          <FormItem>
            <FormLabel>Image Upload</FormLabel>
            <FormControl>
               <div
          {...getRootProps()}
          className="
            w-full p-6 rounded-xl border border-dashed border-muted 
            bg-muted/30 hover:bg-muted/50 transition cursor-pointer 
            flex flex-col items-center gap-4 mb-4
          "
        >
          {/* Hidden input */}
          <input {...getInputProps()} />

          {/* Upload icon */}
          <UploadIcon className="h-10 w-10 text-muted-foreground" />

          {/* Upload text */}
          <div className="text-center space-y-1">
            <p className="text-sm text-foreground">Click to upload or drag & drop</p>
            <p className="text-xs text-muted-foreground">Max 10GB</p>
          </div>

          {/* Animated file list */}
          <div className="w-full space-y-3" ref={autoAnimateRef}>
            {files.map((file) => (
              <div key={file.id}>
                <UploadProgressCard {...file} />
              </div>
            ))}
          </div>
        </div>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
        />
        <FilesDataGrid />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default FormComponent;
