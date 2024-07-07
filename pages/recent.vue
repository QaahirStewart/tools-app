<script setup lang="ts">
import { ref } from 'vue'
import {
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
    today,
} from '@internationalized/date'

import { Calendar as CalendarIcon } from 'lucide-vue-next'

import { cn } from '@/lib/utils'

const df = new DateFormatter('en-US', {
    dateStyle: 'long',
})

const items = [
    { value: 0, label: 'Today' },
    { value: 0.02083, label: 'In 30 mins' }, // Added "In 30 mins"
    { value: 0.04167, label: 'In 1 hour' }, // Added "In 1 hour"
    { value: 1, label: 'Tomorrow' },
    { value: 3, label: 'In 3 days' },
    { value: 7, label: 'In a week' },
]

const endDate = ref<DateValue>()
const { countdown } = useDateCountdown(endDate.value);

</script>

<template>
    <Popover>
        <PopoverTrigger as-child>
            <Button variant="outline" :class="cn(
                'w-[280px] justify-start text-left font-normal',
                !value && 'text-muted-foreground',
            )">
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{ value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date" }}
            </Button>
        </PopoverTrigger>
        <PopoverContent class="flex w-auto flex-col gap-y-2 p-2">
            <Select @update:model-value="(v) => {
                if (!v) return;
                value = today(getLocalTimeZone()).add({ days: Number(v) });
            }">
                <SelectTrigger>
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="item in items" :key="item.value" :value="item.value.toString()">
                        {{ item.label }}
                    </SelectItem>
                </SelectContent>
            </Select>
            <Calendar v-model="endDate" />
        </PopoverContent>
    </Popover>

    <div>{{ countdown }}-{{ endDate }}</div>
</template>