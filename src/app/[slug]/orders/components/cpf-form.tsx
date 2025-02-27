"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import {z} from "zod";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle} from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { isValidCpf, removeCpfPonctuation } from "../../menu/helpers/cpf";


const formSchema = z.object({
        cpf: z
        .string()
        .trim()
        .min(1, { message: "O CPF é obrigatório" })
        .refine((value) => isValidCpf(value), {
            message: "CPF inválido",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

const CpfForm = () => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema)
});
const router = useRouter();
const pathname = usePathname();
const onSubmit = (data: FormSchema) => {
    router.replace(`${pathname}?cpf=${removeCpfPonctuation(data.cpf)}`);
};
const handleCancel = () => {
    router.back()
}
    return (
        <Drawer open>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Vizualizar pedido</DrawerTitle>
                    <DrawerDescription>Insira seu CPF abaixo para vizualizar seus pedidos</DrawerDescription>
                </DrawerHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="cpf"
                            render={({ field }) => (
                                <FormItem className="px-4">
                                <FormLabel>Seu CPF</FormLabel>
                                <FormControl>
                                    <PatternFormat
                                    placeholder="Digite seu CPF..."
                                    format="###.###.###-##"
                                    customInput={Input}
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <DrawerFooter>
                            <Button variant="destructive" className="w-full rounded_full"  type="submit">Confirmar</Button>
                            <DrawerClose asChild>
                                <Button variant="outline" className="ww-full rounded-full" onClick={handleCancel}>Cancelar</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </form>
                </Form>
            </DrawerContent>
        </Drawer>
    )
    ;
}
 
export default CpfForm;