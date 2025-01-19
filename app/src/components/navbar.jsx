import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap'

export const Navbar = () => {
    return (
        <BootstrapNavbar expand="lg" style={{ height: '8vh', backgroundColor: '#1D2429' }}>
            <Container fluid>
                <BootstrapNavbar.Brand href="/" style={{ color: "#eee" }}>Dashcam</BootstrapNavbar.Brand>
            </Container>
        </BootstrapNavbar>
    )
}