import { Eye, EyeOff } from 'lucide-react';

export function PasswordToggle({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="p-1 text-muted-foreground hover:text-foreground" aria-label={visible ? 'Hide password' : 'Show password'}>
      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}
