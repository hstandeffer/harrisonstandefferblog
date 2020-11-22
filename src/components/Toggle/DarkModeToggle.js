import React from 'react'
import useDarkMode from 'use-dark-mode'
import Switch from './Switch'

const DarkModeToggle = () => {
  const darkMode = useDarkMode(false)

  return (
    <Switch
      isOn={darkMode.value}
      handleToggle={darkMode.toggle}
      onColor={`#0f1114`}
    />
  )
}

export default DarkModeToggle