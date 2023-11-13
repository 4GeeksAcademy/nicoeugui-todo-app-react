import React from "react";
import Title from "./title";
import TaskArea from "./taskArea";

// Import Compontents

//create your first component
const Home = () => {
	return (
		<section className="vh-100 w-100 bg-light">
			<Title/>
			<TaskArea/>
		</section>
	);
};

export default Home;
