import { graphql } from "@octokit/graphql";

interface SponsorQueryData {
  viewer: { login: string };
  user: { login: string; isViewerSponsor: boolean } | null;
}

export async function checkSponsorStatus(
  token: string,
  maintainerLogin: string,
): Promise<{ isSponsor: boolean; viewerLogin: string | null }> {
  const client = graphql.defaults({
    headers: { authorization: `bearer ${token}` },
  });
  const data = await client<SponsorQueryData>(
    `query($login: String!) {
       viewer { login }
       user(login: $login) { login isViewerSponsor }
     }`,
    { login: maintainerLogin },
  );
  return {
    isSponsor: data.user?.isViewerSponsor ?? false,
    viewerLogin: data.viewer?.login ?? null,
  };
}
