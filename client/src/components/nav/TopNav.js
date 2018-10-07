import React, {Component} from 'react';
import {Navbar, NavItem, NavDropdown, MenuItem, Row, Col, Grid, Nav, Button} from 'react-bootstrap';
import './TopNav.css';

export default class TopNav extends Component {
    render() {
        return (
            <Grid fluid className="nav-no-pad">
              <Navbar>
          
                  <Navbar.Header>
                    <Navbar.Brand>
                      <a href="#">StreamFilter</a>
                    </Navbar.Brand>
                  </Navbar.Header>
                  <div className="test-net-label">Rinkedy Test Net</div>      
                <Nav pullRight>
                    <Button className="create-room-button">
                      Create
                    </Button>
                </Nav>
            </Navbar>
            </Grid>
            )
    }
}