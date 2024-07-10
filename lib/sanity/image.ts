import createImageUrlBuilder from '@sanity/image-url'

import { dataset, projectId, token} from './env'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId||'',
  dataset: dataset||'', 
})

export const urlForImage = (source:any) => {
  return imageBuilder?.image(source).auto('format').fit('max')
}

async function uploadImage(file:string) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`https://${projectId}.api.sanity.io/v2021-06-07/assets/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data.document.asset._ref;
}

async function uploadImageToSanity(imageString: string, projectId: string, token: string): Promise<string> {
  // Create a blob from the image string
  const blob = await fetch(imageString)
   .then(response => response.blob())
   .then(blob => new File([blob], 'image.jpg', { type: 'image/jpeg' }));

  // Create a URL for the blob
  const url = URL.createObjectURL(blob);

  // Upload the blob to Sanity using fetch
  const response = await fetch(`https://${projectId}.api.sanity.io/v1/assets/images/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/octet-stream'
    },
    body: blob
  });

  // Get the document _id from the response
  const { _id } = await response.json();

  return _id;
}