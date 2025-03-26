import { redirect } from 'next/navigation';

type Props = {};

const Home = (props: Props) => {
	return redirect('/interview');
};

export default Home;
