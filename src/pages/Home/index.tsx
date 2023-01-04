import { Play } from "phosphor-react";
import { useState } from "react";
import { CountDownContainer, FormContainer, HomeContainer, MinutesAmoutInput, Separator, StartCountDownButton, TaskInput } from "./styles";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import * as zod from 'zod'

const newCycleFormValidationSchema = zod.object({
    task: zod.string(). min(1, 'Informe a tarefa'),
    minutesAmout: zod.number().min(5, 'O ciclo precisa ser de no minimo 5 minutos').max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormdata = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle{
    id: string;
    task: string;
    minutesAmout: number;
}

export function Home(){
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const {register, handleSubmit, watch, reset} = useForm<NewCycleFormdata>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues:{
            task: '',
            minutesAmout: 0
        }
    });

    function handleCreateNewCycle(data: NewCycleFormdata){
        const id = String(new Date().getTime());

        const newCycle : Cycle = {
            id,
            task: data.task,
            minutesAmout: data.minutesAmout
        }

        setCycles((state) => [...cycles, newCycle])
        setActiveCycleId(id)
        reset();
    }

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycle);

    console.log(activeCycle);

    const task = watch('task')
    const isSubmitDisabled = !task

    return(
        <HomeContainer>
            <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormContainer >
                    <label htmlFor="">Vou trabalhar em</label>
                    <TaskInput 
                        id="task"
                        list="task-sugestion" 
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
                        id="minutesAmout" 
                        step={5}
                        min={5}
                        max={60}
                        {...register('minutesAmout', {valueAsNumber: true} )}
                    />

                    <span>minutos.</span>
                </FormContainer>
            <CountDownContainer>
                <span>0</span>
                <span>0</span>
                <Separator>:</Separator>
                <span>0</span>
                <span>0</span>
            </CountDownContainer>

            <StartCountDownButton disabled={isSubmitDisabled} type="submit">
                <Play size={24} />
                Começar
            </StartCountDownButton>
            </form>

        </HomeContainer>
    );
}