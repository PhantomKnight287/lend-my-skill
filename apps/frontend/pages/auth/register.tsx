import { useState } from "react";
import { Stepper, Button, Group } from "@mantine/core";
import { Container } from "@components/container";
import { MetaTags } from "@components/meta";
import { FirstForm } from "@components/fragements";

function Register() {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  return (
    <Container>
      <MetaTags
        title="Register | Lend my Skill"
        description="Register to lend your skill to the world"
      />
      <Stepper
        active={active}
        color="green"
        onStepClick={setActive}
        breakpoint="sm"
      >
        <Stepper.Step
          label="First step"
          description="Create an account"
          allowStepSelect={active > 0}
          data-active={active == 0}
        >
          <FirstForm />
        </Stepper.Step>
        <Stepper.Step
          label="Second step"
          description="Verify email"
          allowStepSelect={active > 1}
        >
          Step 2 content: Verify email
        </Stepper.Step>
        <Stepper.Step
          label="Final step"
          description="Get full access"
          allowStepSelect={active > 2}
        >
          Step 3 content: Get full access
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>

      <Group position="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Next step</Button>
      </Group>
    </Container>
  );
}

export default Register;
