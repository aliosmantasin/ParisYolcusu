import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function QuestionsSSS() {
  const t = useTranslations("FAQ");

  return (
    <section className="my-20 bg-slate-50 dark:bg-black p-2">
      <div className="w-full text-center p-2">
        <h2 className="text-[#067481] font-bold text-3xl my-3">{t("title")}</h2>
      </div>
      <div className="max-w-2xl flex mx-auto">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>{t("question1")}</AccordionTrigger>
            <AccordionContent>{t("answer1")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>{t("question2")}</AccordionTrigger>
            <AccordionContent>{t("answer2")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>{t("question3")}</AccordionTrigger>
            <AccordionContent>{t("answer3")}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
