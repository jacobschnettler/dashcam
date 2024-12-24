import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap'

export const Footer = () => {
    return (
        <BootstrapNavbar expand="lg" className="bg-body-tertiary" style={{ height: '8vh' }}>
            <Container fluid>
                <BootstrapNavbar.Brand href="#">Home</BootstrapNavbar.Brand>
            </Container>
        </BootstrapNavbar>
    )
}