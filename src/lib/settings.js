import Settings from '@/models/Settings';
import dbConnect from './db';

export async function getSetting(key, defaultValue) {
  await dbConnect();
  const setting = await Settings.findOne({ key });
  return setting ? setting.value : defaultValue;
}

export async function setSetting(key, value) {
  await dbConnect();
  await Settings.findOneAndUpdate(
    { key },
    { value },
    { upsert: true, new: true }
  );
}
