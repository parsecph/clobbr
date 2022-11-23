import { useRouter } from 'next/router';

const Result = () => {
  const router = useRouter();
  const { result } = router.query;

  return (
    <div>
      <h1>Result</h1>

      {result}
    </div>
  );
};

export default Result;
