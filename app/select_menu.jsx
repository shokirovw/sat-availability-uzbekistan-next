/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example({ regions_list, selected_region_idx, setRegionIndex }) {
  return (
    <Listbox value={selected_region_idx} onChange={setRegionIndex}>
      {({ open }) => (
        <>
          <div className="relative font-publicsans w-full">
            <Listbox.Button className="bg-secondary relative w-full rounded-3xl shadow-sm pl-5 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-2 focus:ring-violet-300/80 focus:border-violet-300/80 sm:text-sm">
              <span className="block truncate text-base">{regions_list[selected_region_idx]}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-200">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
</svg>

              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-50 ml-0.5 mt-1.5 w-full bg-violet-50 max-h-36 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                {regions_list.map((region_name, idx) => (
                  <Listbox.Option
                    key={idx}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-gray-900 bg-violet-100' : 'text-gray-900',
                        'cursor-default select-none relative py-2 pl-3 pr-9'
                      )
                    }
                    value={idx}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {region_name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-indigo-600' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
</svg>
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
