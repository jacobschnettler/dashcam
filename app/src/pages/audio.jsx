import { Card } from "react-bootstrap";
import { Navbar } from "../components";

export function AudioPage() {
    return (
        <div>
            <Navbar />

            <div className="container-fluid pt-3">
                <Card body>
                    <Card.Title>Audio Management</Card.Title>
                </Card>
            </div>
        </div>
    )
}
