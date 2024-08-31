import { generateReactNativeHelpers } from "@uploadthing/expo";
import { createUploadthing, UploadThingError } from "uploadthing/server";
import type { FileRouter } from "uploadthing/server";
import { endpoint } from "./env";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

const uploadRouter = {
  profileImage: f({
    image: {
      maxFileSize: "4MB",
    },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(({ file, metadata }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
export type UploadRouter = typeof uploadRouter;

export const { useImageUploader, useDocumentUploader } =
  generateReactNativeHelpers<UploadRouter>({
    /**
     * Your server url.
     * @default process.env.EXPO_PUBLIC_SERVER_URL
     * @remarks In dev we will also try to use Expo.debuggerHost
     */
    url: `${endpoint}/uploadthing`,
  });