import { HeaderContainer } from './styles' 
import LogoPhomodoro from '../../assets/Logo.svg'
import {Timer, Scroll} from 'phosphor-react'
import { NavLink } from 'react-router-dom';
export function Header(){
    return(
        <HeaderContainer>
            <img src={LogoPhomodoro}/>
            <nav>
                <NavLink to="/" title="Timer">
                    <Timer size={24}/>
                </NavLink>
                <NavLink to="/history" title="histórico">
                    <Scroll size={24}/>
                </NavLink>
            </nav>
        </HeaderContainer>
    );
}