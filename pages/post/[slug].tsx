import { useRouter } from "next/router";

import { DefaultLayout } from "../../components/Layouts";

const Posts = () => {
  const router = useRouter();
  const { slug } = router.query;

  return <DefaultLayout>Post {slug}</DefaultLayout>;
};

export default Posts;
