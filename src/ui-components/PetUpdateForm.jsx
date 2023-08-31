/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Pet } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
export default function PetUpdateForm(props) {
  const {
    id: idProp,
    pet: petModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: "",
    age: "",
    breed: "",
    about: "",
    image: "",
    color: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [age, setAge] = React.useState(initialValues.age);
  const [breed, setBreed] = React.useState(initialValues.breed);
  const [about, setAbout] = React.useState(initialValues.about);
  const [image, setImage] = React.useState(initialValues.image);
  const [color, setColor] = React.useState(initialValues.color);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = petRecord
      ? { ...initialValues, ...petRecord }
      : initialValues;
    setName(cleanValues.name);
    setAge(cleanValues.age);
    setBreed(cleanValues.breed);
    setAbout(cleanValues.about);
    setImage(cleanValues.image);
    setColor(cleanValues.color);
    setErrors({});
  };
  const [petRecord, setPetRecord] = React.useState(petModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp ? await DataStore.query(Pet, idProp) : petModelProp;
      setPetRecord(record);
    };
    queryData();
  }, [idProp, petModelProp]);
  React.useEffect(resetStateValues, [petRecord]);
  const validations = {
    name: [{ type: "Required" }],
    age: [{ type: "Required" }],
    breed: [],
    about: [],
    image: [],
    color: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          name,
          age,
          breed,
          about,
          image,
          color,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await DataStore.save(
            Pet.copyOf(petRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "PetUpdateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              age,
              breed,
              about,
              image,
              color,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Age"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={age}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              age: value,
              breed,
              about,
              image,
              color,
            };
            const result = onChange(modelFields);
            value = result?.age ?? value;
          }
          if (errors.age?.hasError) {
            runValidationTasks("age", value);
          }
          setAge(value);
        }}
        onBlur={() => runValidationTasks("age", age)}
        errorMessage={errors.age?.errorMessage}
        hasError={errors.age?.hasError}
        {...getOverrideProps(overrides, "age")}
      ></TextField>
      <TextField
        label="Breed"
        isRequired={false}
        isReadOnly={false}
        value={breed}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              age,
              breed: value,
              about,
              image,
              color,
            };
            const result = onChange(modelFields);
            value = result?.breed ?? value;
          }
          if (errors.breed?.hasError) {
            runValidationTasks("breed", value);
          }
          setBreed(value);
        }}
        onBlur={() => runValidationTasks("breed", breed)}
        errorMessage={errors.breed?.errorMessage}
        hasError={errors.breed?.hasError}
        {...getOverrideProps(overrides, "breed")}
      ></TextField>
      <TextField
        label="About"
        isRequired={false}
        isReadOnly={false}
        value={about}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              age,
              breed,
              about: value,
              image,
              color,
            };
            const result = onChange(modelFields);
            value = result?.about ?? value;
          }
          if (errors.about?.hasError) {
            runValidationTasks("about", value);
          }
          setAbout(value);
        }}
        onBlur={() => runValidationTasks("about", about)}
        errorMessage={errors.about?.errorMessage}
        hasError={errors.about?.hasError}
        {...getOverrideProps(overrides, "about")}
      ></TextField>
      <TextField
        label="Image"
        isRequired={false}
        isReadOnly={false}
        value={image}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              age,
              breed,
              about,
              image: value,
              color,
            };
            const result = onChange(modelFields);
            value = result?.image ?? value;
          }
          if (errors.image?.hasError) {
            runValidationTasks("image", value);
          }
          setImage(value);
        }}
        onBlur={() => runValidationTasks("image", image)}
        errorMessage={errors.image?.errorMessage}
        hasError={errors.image?.hasError}
        {...getOverrideProps(overrides, "image")}
      ></TextField>
      <TextField
        label="Color"
        isRequired={false}
        isReadOnly={false}
        value={color}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              age,
              breed,
              about,
              image,
              color: value,
            };
            const result = onChange(modelFields);
            value = result?.color ?? value;
          }
          if (errors.color?.hasError) {
            runValidationTasks("color", value);
          }
          setColor(value);
        }}
        onBlur={() => runValidationTasks("color", color)}
        errorMessage={errors.color?.errorMessage}
        hasError={errors.color?.hasError}
        {...getOverrideProps(overrides, "color")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || petModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || petModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
