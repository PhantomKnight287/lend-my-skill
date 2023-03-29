# Welcome to Lend My Skill's  Contribution Guide
Thanks for investing your precious time to contribute to this repository.

Please read our [Code of Conduct](/CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

## Getting Started

### Prerequisites
- Nodejs v16.x
- pnpm
- supabase account
- postgresql(you can also use supabase)

### Cloning the repo
- Fork the repo, make sure to fork all branches and not just main.
- Clone the forked repo from your account.
You can switch to main branch if you want stable code. To contribute, you must create a new branch from `development` branch. 

### Arranging Env variables
Each folder in `apps` using env variables has an `.env.example` which can be used a template.

#### For frontend
- `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_URL`
Go to [supabase.com](https://app.supabase.com) and create an account or login to your account. Create a new project and open that project.
You'll be greated by a ui like this:
![image](/assets/dashboard.png)

Click on `storage` from sidebar and click on `Create New Bucket` button. Create a bucket with name set to `images` and be sure to make it public. Click on `Create Bucket` and new bucket will be created. Click on Bucket name and click on `Create Folder` and name it anything but without spaces. Click on folder name and upload any file. Click on uploaded file and click on `Copy URL`. The url will look something like this:

```
https://<project id>.supabase.co/storage/v1/object/public/<bucket name>/<folder name>/<image name>.<image extension>
```

remove `/<folder name>/<image name>.<image extension>` and copy the url. Now you've your bucket url.

- `NEXT_PUBLIC_RAZORPAY_KEY`
Sign in into [Razorpay](https://razorpay.com) and click on Settings in the left sidebar. Click on `Api Keys` tab and generate a new pair. **This is only needed if you need to work with payments. If not, set it to any string**
- `SECRET`
This is the webhook secret which will be used to validate the webhook sent by backend to revalidate pages. Make sure it matches in the backend. You can set it to anything. To generate this you can use:
```bash
 node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
This will give you a long random string which you can use as a secret.

- `NEXT_PUBLIC_API_URL`
The url where you backend is hosted. Set it to `https://localhost:5000` during development.

### For Backend

- `JWT_SECRET`
> can be generated like `SECRET` for frontend.

- `PORT`
> The port on which the backend will run

- `REFRESH_TOKEN`
> can be generated like `SECRET` for frontend

- `SUPABASE_URL`
> can be found in `API` tab of `Settings` in your supabase project.

- `SUPABASE_KEY`
> This will be labeled as `service_role` in same tab

- `RAZORPAY_KEY` & `RAZORPAY_SECRET`
> Same as `NEXT_PUBLIC_RAZORPAY_KEY` for frontend.

- `RAZORPAY_WEBHOOK_SECRET`
> The webhook secret you entered in razorpay's dashboard, will be used to verify webhooks. 

- `DATABASE_URL`
> The url of postgresql database. If you want to use supabase for this, please read [this](https://flaviocopes.com/postgresql-supabase-setup/)

- `SECRET`
> Secret which will be sent along the payload to frontend to generate new pages.

- `SITE_URL`
> The url of frontend

### For App
- `API_URL`
> The url of the backend. Set this to `http://10.0.2.2:5000` for emulators

> **Note**
> You'll need `pnpm` and `yarn` to run commands in this repo. To activate `pnpm` and `yarn` you can use [Corepack](https://github.com/nodejs/corepack#-corepack)

## Installing Modules

Modules in all dirs except `apps/mobile` can be installed by `pnpm`. The `apps/mobile` is an expo app which currently doesn't support `pnpm`'s symlinks.

## Commit Convention
Lend my skill is a monorepo, thus it is very important to write correct commit messages to keep the git history clean and consitent. All the commits made in this repo are divided into 3 groups:

- **app** related to `frontend`,`backend` and `mobile`
- **docs** related to api docs located at `apps/docs`
- **misc** only related to things like contribution guidelines, readme etc.

Example:
`[frontend] setup tailwindcss`
`[backend] remove any from ServicesController`
`[mobile] link login screen to backend`
`[misc] fix broken image in readme`


