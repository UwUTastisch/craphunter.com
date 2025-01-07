import type { LayoutServerLoad } from './$types';


export const load: LayoutServerLoad = async ({ request }) => {
  const userID = null; //parseUserIDFromCookies(request.headers.get('cookie'));
  if (!userID) {
    return { user: null };
  }
  const user = null; //await pb.collection('users').get(userID);
  return { user };
};
