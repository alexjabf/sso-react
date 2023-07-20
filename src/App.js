import './App.css';
import RoutesWrapper from './components/RoutesWrapper';
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
const App = () => {
    return (
        <>
            <NavigationBar/>
            <RoutesWrapper/>
            <Footer/>
        </>
    );
};

export default App;
