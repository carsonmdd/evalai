import { redirect } from 'next/navigation';

const Home = () => {
	return redirect('/sign-in');
};

export default Home;
