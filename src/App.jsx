import './App.css'
import ProductList from "./components/ProductList/ProductList.jsx";


function App() {

  return (
    <div className="App">
      <h1 className="title">Список товаров</h1>
      <section className="container">
        <ProductList />
      </section>

    </div>
  )
}

export default App
