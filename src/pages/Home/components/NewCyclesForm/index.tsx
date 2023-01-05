import { FormContainer, MinutesAmoutInput, TaskInput } from "./styles";

import { useContext } from "react";
import { CyclesContext } from "../..";
import { useFormContext} from 'react-hook-form';




export function NewCycleForm() {

    const { activeCycle } = useContext(CyclesContext)
    const {register} = useFormContext()
 


    return (
        <FormContainer >
            <label htmlFor="">Vou trabalhar em</label>
            <TaskInput
                id="task"
                list="task-sugestion"

                disabled={!!activeCycle}
                placeholder="Dê um nome para o seu projeto"
                {...register('task')}
            />

            <datalist id="task-sugestion">
                <option value="Projeto 1"></option>
                <option value="Projeto 2"></option>
                <option value="Projeto 3"></option>
                <option value="Banana"></option>
            </datalist>

            <label htmlFor="">durante</label>
            <MinutesAmoutInput
                placeholder="00"
                type="number"
                disabled={!!activeCycle}
                min={1}
                step={5}
                max={60}
                id="minutesAmout"
                {...register('minutesAmout', { valueAsNumber: true })}
            />

            <span>minutos.</span>
        </FormContainer>
    );
}