This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## First-time setup

1. Install node: (I'm using node v24)
2. Install node modules: `npm i`
3. Create a .env based on .env.example

## Getting Started

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Usecase

Generate an image without an existing reference:

1. You can input your story / passage to generate a prompt to use with our "OpenArt" account
2. You can then put that prompt into "OpenArt"
3. to generate an image in the style

Generating an interim image

1. Head to the AI frame editor
2. Select a reference image (existing image)
3. Point out what about that image you want it to keep
4. Tell it what the new image should look like
5. The output will be saved on your computer and a preview displayed

Editing an existing image

1. Head to the AI frame editor
2. Select a the image to (existing image)
3. Point out what about that image you want it to keep
4. Tell it what the new image should look like
5. The output will be saved on your computer and a preview displayed

## Potential Next Steps

Limitations

- Currently the app processes images one at a time. This makes it hard to apply the same edit across multiple pictures.
  - The OpenAI edit image endpoint can accept multiple images at once.
  - This would be worth exploring to see if we can apply the same change
  - e.g. Trying to remove the beard from Abraham across multiple images in the same way
