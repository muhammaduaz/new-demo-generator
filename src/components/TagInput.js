import { TagInput } from "evergreen-ui";
import { useState, useMemo } from 'react'

const Tags = () => {
  
  const [values, setValues] = useState([])
  const allValues = [
    "Podcast",
    "Multi-brand",
    "Mortgage",
    "Food & Beverage",
    "Package Delivery",
    "Scooters / MicroMobility",
    "OTT",
    "Ski & Snowboard",
    "Basketball",
    "Infrastructure",
    "Publishing Software"
  ]
  const autocompleteItems = useMemo(() => allValues.filter((i) => !values.includes(i)), [allValues, values])

  return (
    <TagInput
      className='tag-input'
      inputProps={{ placeholder: 'Enter Tags or Pick from List' }}
      values={values}
      onChange={setValues}
      autocompleteItems={autocompleteItems}
    />
  )
}

export default Tags

