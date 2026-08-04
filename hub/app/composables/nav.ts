export default function useNav() {
  const baseLinks = {
    index: '/',
    iamUsers: "/iam/users",
    iamDomains: '/iam/domains'
  };

  return {
    baseLinks,
  };
}
