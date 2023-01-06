import { Circle, Divide, HandPalm, Play } from "phosphor-react";
import { createContext, useEffect, useState } from "react";
import { HomeContainer, StartCountDownButton, StopCountDownButton } from "./styles";
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInSeconds } from 'date-fns'
import { CountDown } from "./components/CountDown";
import { NewCycleForm } from "./components/NewCyclesForm";
import { useForm , FormProvider} from 'react-hook-form';
import * as zod from 'zod'


interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    finishedDate?: Date;
}

interface CyclesContextType {
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    MarkCurrentCycleAsFinished: () => void;
    amoutSecondsPassed: number;
    setSecondsPassed: (seconds: number) => void;
}

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmout: zod.number().min(1, 'O ciclo precisa ser de no minimo 5 minutos').max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormdata = zod.infer<typeof newCycleFormValidationSchema>




export const CyclesContext = createContext({} as CyclesContextType);
export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amoutSecondsPassed, setAmoutSecondsPassed] = useState(0)

    const newCycleForm = useForm<NewCycleFormdata>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmout: 0
        }
    });
    
    const { handleSubmit, watch, reset } = newCycleForm

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    function setSecondsPassed(seconds: number){
        setAmoutSecondsPassed(seconds)
    }

    function MarkCurrentCycleAsFinished() {
        setCycles(
            (state) => state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, finishedDate: new Date() }
                } else {
                    return cycle
                }
            }),
        )
    }

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

    function handleInterruptCycle() {
        setCycles(
            (state) => state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, interruptedDate: new Date() }
                } else {
                    return cycle
                }
            }))

        setActiveCycleId(null)


    }


    const task = watch('task')
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
                <CyclesContext.Provider value={{ activeCycle, activeCycleId,amoutSecondsPassed, MarkCurrentCycleAsFinished, setSecondsPassed  }}>
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>
                    <CountDown />
                </CyclesContext.Provider>
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