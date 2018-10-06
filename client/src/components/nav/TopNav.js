import React, {Component} from 'react';
import {Navbar, NavItem, NavDropdown, MenuItem, Row, Col, Grid, Nav} from 'react-bootstrap';

export default class TopNav extends Component {
    render() {
        return (
            <Grid fluid>
              <Navbar>
                  <Navbar.Header>
                    <Navbar.Brand>
                      <a href="#">StreamFilter</a>
                    </Navbar.Brand>
                  </Navbar.Header>
              <Nav>

              </Nav>
            </Navbar>
            </Grid>
            )
    }
}