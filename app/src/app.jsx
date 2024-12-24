import { Navbar, Footer } from './components'
import { ClipsPage } from './clips'

function App() {
  return window.location.pathname.startsWith('/clips') ? (
    <ClipsPage />
  ) : (
    <div>
      <Navbar />

      <div style={{ padding: '15px', width: '100%' }}>
        <div style={{ height: "500px", backgroundColor: 'black', borderRadius: "8px" }}>

        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: "30px" }}>
          <div style={{ height: "150px", width: "150px", backgroundColor: 'gray', borderRadius: '16px', marginRight: '20px', cursor: 'pointer' }}>

          </div>

          <a href='/clips'>
            <div style={{ height: "150px", width: "150px", backgroundColor: 'gray', borderRadius: '16px', marginLeft: '20px', cursor: 'pointer' }}>

            </div>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
