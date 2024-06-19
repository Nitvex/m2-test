import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AssetList from "./pages/AssetList/AssetList";
import AssetDetail from "./pages/AssetDetail/AssetDetail";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<AssetList />} />
				<Route path="/asset/:symbol" element={<AssetDetail />} />
			</Routes>
		</Router>
	);
};

export default App;
