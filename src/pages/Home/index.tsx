import { Circle, Divide, HandPalm, Play } from "phosphor-react";
import { useEffect, useState } from "react";
import { CountDownContainer, FormContainer, HomeContainer, MinutesAmoutInput, Separator, StartCountDownButton, TaskInput, StopCountDownButton } from "./styles";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { differenceInSeconds } from 'date-fns'

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmout: zod.number().min(5, 'O ciclo precisa ser de no minimo 5 minutos').max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormdata = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
}

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amoutSecondsPassed, setAmoutSecondsPassed] = useState(0)

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormdata>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmout: 0
        }
    });

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    useEffect(() => {
        let interval: number;
        if (activeCycle) {
            const interval = setInterval(() => {
                setAmoutSecondsPassed(
                    differenceInSeconds(new Date(), activeCycle.startDate),
                )
            }, 1000)
            return () => {
                clearInterval(interval)
            }
        }
    }, [activeCycle])


    function handleCreateNewCycle(data: NewCycleFormdata) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmout,
            startDate: new Date(),
        }

        setCycles((state) => [...cycles, newCycle])
        setActiveCycleId(id)
        setAmoutSecondsPassed(0);
        reset();
    }

    function handleInterruptCycle(){

        setCycles(
            cycles.map((cycle) => {
            if(cycle.id === activeCycleId){
                return {...cycle, interruptedDate: new Date()}
            }else{
                return cycle
            }
        }))

        setActiveCycleId(null)


    }
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
    const currentSeconds = activeCycle ? totalSeconds - amoutSecondsPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        if (activeCycle) {
            document.title = `Ignte Timer - ${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

    const task = watch('task')
    const isSubmitDisabled = !task

    console.log(cycles)

    return (
        <HomeContainer>
            <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
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
                        id="minutesAmout"
                        {...register('minutesAmout', { valueAsNumber: true })}
                    />

                    <span>minutos.</span>
                </FormContainer>
                <CountDownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountDownContainer>

                {
                    activeCycle ? (
                    <StopCountDownButton onClick={handleInterruptCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountDownButton>) : 
                    (
                        <StartCountDownButton disabled={isSubmitDisabled} type="submit">
                            <Play size={24} />
                            Começar
                        </StartCountDownButton>
                    )
                }

            </form>

        </HomeContainer>
    );
}