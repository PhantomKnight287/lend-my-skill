## Welcome to Lend My Skill Contribution Guide

Thanks for investing your precious time to contribute to this repository.

Read our [Code Of Conduct](/CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

## Getting Started

### Setting up this repository

To contribute to `Backend` and `Frotend`, you will need nodejs `v16.x`. Please refrain from using any other version. To contribute to `apps/mobile`, you will need `Flutter>=3.3.10 • channel stable`.

### Arranging Environment Variables

Each folder in `apps` using environment variables has an `.env.example`, which you can use as a template.

### For Frontend

#### Getting `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_URL`

### How to get storage bucket url?

Go to [supabase.com](https://app.supabase.com) and create an account or login to your account. Create a new project and open that project.

You'll be greated by a ui like this:

![image](/assets/dashboard.png)

Click on `storage` from sidebar and click on `Create New Bucket` button. Create a bucket with name set to `images` and be sure to make it public. Click on `Create Bucket` and new bucket will be created. Click on Bucket name and click on `Create Folder` and name it anything but without spaces. Click on folder name and upload any file. Click on uploaded file and click on `Copy URL`. The url will look something like this:

```
https://<project id>.supabase.co/storage/v1/object/public/<bucket name>/<folder name>/<image name>.<image extension>
```

remove `/<image name>.<image extension>` and copy the url. Now you've your bucket url.

#### Getting `NEXT_PUBLIC_RAZORPAY_KEY`

Sign in into [Razorpay](https://razorpay.com) and click on Settings in the left sidebar. Click on `Api Keys` tab and generate a new pair

### For Backend

The instructions are provided in `.env.example`

> **Warning**
> You'll need `pnpm` to run commands in this repo.
> Run `corepack prepare pnpm@7.14.0 --activate` in Administrator powershell window or `sudo corepack prepare pnpm@7.14.0 --activate` for mac and linux.

Now run `pnpm dev`, This will run the dev server and you'll be able to access the frontend on `http://localhost:3000` and backend at `http://localhost:5000`.

## Commit Convention

Please make sure to follow the commit convention. The commit must start with the scope([frontend],[backend],[db],[app],[misc],[info]) followed by a sensible commit message in present tense.

Example: `[frontend] Update mantine to version 5.9`

> **Warning**
> Please DO NOT commit all files in 1 commit. Please make separate commit for each file.

## Contributing in Frontend

If you just want to contribute for frontend, you can find all the api docs on [this](https://phantomknight287.github.io/lend-my-skill/) link. You can also find examples of response returned by the api so you can integrate it with the backend and also add type of the response.
