import React, { useState } from 'react';
import {
  Gamepad2,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  X,
  Layers,
  Flame,
  Search,
  BookOpen,
  HelpCircle,
  Clock,
  Zap,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Game, GameCategory, EnergyLevel, Environment, DogMotivation, DogSize, GameStep } from '../types';
import { soundFx } from '../utils/audio';

interface Props {
  games: Game[];
  onSaveGame: (game: Game) => Promise<void>;
  onDeleteGame: (gameId: string) => Promise<void>;
  onToggleArchive: (gameId: string, isArchived: boolean) => Promise<void>;
  onPreviewGame?: (game: Game) => void;
}

const CATEGORIES: { value: GameCategory; label: string; icon: string }[] = [
  { value: 'curiosity', label: 'Curiosity & Scent', icon: '👃' },
  { value: 'problem_solving', label: 'Problem-Solving & Brain', icon: '🧩' },
  { value: 'agility', label: 'Agility & Movement', icon: '🏃' },
];

const ENERGY_LEVELS: EnergyLevel[] = ['low', 'medium', 'high'];
const ENVIRONMENTS: Environment[] = ['indoor', 'outdoor', 'both'];
const SIZES: DogSize[] = ['small', 'medium', 'large', 'giant'];
const MOTIVATIONS: DogMotivation[] = [
  'food',
  'toys_fetch',
  'tug',
  'praise_affection',
  'chase_speed',
  'sniffing',
];

const ILLUSTRATION_OPTIONS = [
  { key: 'snuffle_mat', label: 'Snuffle Mat Sniffer' },
  { key: 'box_sniff', label: 'Cardboard Box Flaps' },
  { key: 'muffin_tin', label: 'Muffin Tin Balls' },
  { key: 'cup_shuffle', label: 'Cup Shell Shuffle' },
  { key: 'frozen_kong', label: 'Kong Fortress' },
  { key: 'towel_burrito', label: 'Towel Roll Unroll' },
  { key: 'bottle_spinner', label: 'Bottle Spinner' },
  { key: 'broomstick_hurdles', label: 'Broomstick Hurdle Jump' },
  { key: 'obstacle_dash', label: 'Slalom & Agility Zoomies' },
  { key: 'hula_hoop', label: 'Hula Hoop Portal' },
  { key: 'secret_tunnel', label: 'Secret Tunnel Pass' },
  { key: 'sock_heist', label: 'Striped Sock Chase' },
];

export default function AdminGamesManager({
  games,
  onSaveGame,
  onDeleteGame,
  onToggleArchive,
  onPreviewGame,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Partial<Game> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields State
  const [materialsText, setMaterialsText] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [steps, setSteps] = useState<GameStep[]>([]);

  const filteredGames = games.filter((g) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      g.title.toLowerCase().includes(q) ||
      g.tagline.toLowerCase().includes(q) ||
      g.id.toLowerCase().includes(q);

    const matchesCat = categoryFilter === 'all' || g.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenNewGame = () => {
    soundFx.playBoop(580);
    const newId = `custom-game-${Date.now().toString().slice(-6)}`;
    const initialGame: Partial<Game> = {
      id: newId,
      title: '',
      tagline: '',
      category: 'problem_solving',
      energyLevel: 'medium',
      environment: 'indoor',
      durationMinutes: 10,
      suitableSizes: ['small', 'medium', 'large', 'giant'],
      primaryMotivations: ['toys_fetch', 'food'],
      nonFoodAlternative: 'Use a high-value squeaky ball or enthusiastic personal praise!',
      materials: ['Household safe props'],
      steps: [
        {
          stepNumber: 1,
          title: 'Setup the playing area',
          instruction: 'Arrange your props on a non-slip rug or soft lawn.',
          proTip: 'Keep initial sessions short and upbeat.',
        },
        {
          stepNumber: 2,
          title: 'Guide your canine partner',
          instruction: 'Show them the initial target and offer encouragement.',
          proTip: 'Celebrate every micro-success!',
        },
      ],
      bondTip: 'Celebrate with soft praise and gentle ear scratches—keep it fun and pressure-free!',
      funnyQuote: 'A tired dog with an engaged mind is the most peaceful roommate on Earth.',
      illustrationKey: 'box_sniff',
      isCustom: true,
      isArchived: false,
    };

    setEditingGame(initialGame);
    setMaterialsText(initialGame.materials?.join('\n') || '');
    setSkillsText('Brain Stimulation, Canine Focus, Confidence');
    setSteps(initialGame.steps || []);
    setIsEditingModalOpen(true);
    setErrorMessage(null);
  };

  const handleOpenEdit = (game: Game) => {
    soundFx.playBoop(540);
    setEditingGame({ ...game });
    setMaterialsText(game.materials?.join('\n') || '');
    setSkillsText(game.skillBuilds?.join(', ') || '');
    setSteps(game.steps || []);
    setIsEditingModalOpen(true);
    setErrorMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame || !editingGame.title?.trim()) {
      setErrorMessage('Game title is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    try {
      const parsedMaterials = materialsText
        .split('\n')
        .map((m) => m.trim())
        .filter(Boolean);

      const parsedSkills = skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const completeGame: Game = {
        id: editingGame.id || `custom-${Date.now()}`,
        title: editingGame.title.trim(),
        tagline: editingGame.tagline?.trim() || 'A fun and engaging canine adventure!',
        category: (editingGame.category as GameCategory) || 'curiosity',
        energyLevel: (editingGame.energyLevel as EnergyLevel) || 'medium',
        environment: (editingGame.environment as Environment) || 'indoor',
        durationMinutes: Number(editingGame.durationMinutes) || 8,
        suitableSizes: editingGame.suitableSizes?.length ? editingGame.suitableSizes : ['small', 'medium', 'large', 'giant'],
        primaryMotivations: editingGame.primaryMotivations?.length ? editingGame.primaryMotivations : ['food', 'toys_fetch'],
        nonFoodAlternative: editingGame.nonFoodAlternative?.trim() || 'Use an enthusiastic ball toss or victory cuddle!',
        materials: parsedMaterials.length ? parsedMaterials : ['Household safe items'],
        skillBuilds: parsedSkills.length ? parsedSkills : ['Mental Workout', 'Bond Building'],
        steps: steps.length ? steps : [
          { stepNumber: 1, title: 'Kickoff', instruction: 'Start the game with clear upbeat energy.' }
        ],
        bondTip: editingGame.bondTip?.trim() || 'Stay relaxed, cheer your dog on, and keep play positive!',
        funnyQuote: editingGame.funnyQuote?.trim() || 'Dogs love solving puzzles almost as much as naps.',
        illustrationKey: editingGame.illustrationKey || 'snuffle_mat',
        isSecret: !!editingGame.isSecret,
        isCustom: true,
        isArchived: !!editingGame.isArchived,
        updatedAt: new Date().toISOString(),
      };

      await onSaveGame(completeGame);
      soundFx.playFanfare();
      setSaveSuccessMsg(`Successfully saved "${completeGame.title}"!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
      setIsEditingModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to save game. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStepChange = (index: number, field: keyof GameStep, value: string) => {
    setSteps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        stepNumber: prev.length + 1,
        title: `Step ${prev.length + 1}`,
        instruction: '',
        proTip: '',
      },
    ]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, stepNumber: i + 1 })));
  };

  return (
    <div id="admin-games-manager" className="space-y-6 animate-in fade-in duration-200">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-black text-stone-900">
              Games Catalog Management
            </h2>
          </div>
          <p className="text-xs text-stone-500 max-w-xl">
            Create brand new games, update steps, switch illustrations, or archive games across the app. All active games sync immediately for players.
          </p>
        </div>

        <button
          id="admin-create-game-btn"
          onClick={handleOpenNewGame}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Game</span>
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-stone-200/80">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            id="admin-search-games-input"
            type="text"
            placeholder="Search game title, tagline, materials, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-stone-800 placeholder-stone-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            id="admin-filter-games-category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700"
          >
            <option value="all">All Categories ({games.length})</option>
            <option value="curiosity">Curiosity & Scent</option>
            <option value="problem_solving">Problem-Solving</option>
            <option value="agility">Agility & Movement</option>
          </select>
        </div>
      </div>

      {/* Games Catalog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map((game) => {
          const isArchived = !!game.isArchived;

          return (
            <div
              key={game.id}
              className={`p-5 rounded-3xl bg-white border transition-all flex flex-col justify-between ${
                isArchived
                  ? 'border-dashed border-stone-300 opacity-60 bg-stone-50/70'
                  : 'border-stone-200 shadow-xs hover:border-amber-300 hover:shadow-sm'
              }`}
            >
              <div className="space-y-3">
                {/* Header Tag and Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-lg bg-stone-100 text-[10px] font-black uppercase text-stone-600">
                      {game.category.replace('_', ' ')}
                    </span>
                    {game.isCustom && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-[10px] font-black uppercase text-amber-800">
                        Admin Custom
                      </span>
                    )}
                    {isArchived && (
                      <span className="px-2 py-0.5 rounded-lg bg-stone-200 text-[10px] font-black text-stone-600">
                        Archived / Hidden
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleArchive(game.id, !isArchived)}
                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
                      title={isArchived ? 'Unhide Game' : 'Archive / Hide from app'}
                    >
                      {isArchived ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(game)}
                      className="p-1.5 rounded-lg hover:bg-amber-50 text-stone-500 hover:text-amber-700 transition-colors"
                      title="Edit game configuration"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {game.isCustom && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${game.title}"? This cannot be undone.`)) {
                            onDeleteGame(game.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Delete custom game"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="font-display font-black text-base text-stone-900 leading-snug">
                    {game.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                    {game.tagline}
                  </p>
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap gap-2 text-[11px] font-bold text-stone-600">
                  <span className="flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-xl">
                    <Clock className="w-3 h-3 text-stone-400" />
                    {game.durationMinutes}m
                  </span>
                  <span className="flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-xl capitalize">
                    <Flame className="w-3 h-3 text-orange-500" />
                    {game.energyLevel} energy
                  </span>
                  <span className="bg-stone-100 px-2 py-1 rounded-xl">
                    {game.steps.length} steps
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="font-mono text-stone-400 truncate max-w-[120px]">
                  ID: {game.id}
                </span>

                {onPreviewGame && (
                  <button
                    onClick={() => onPreviewGame(game)}
                    className="font-bold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    Preview in App →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT / CREATE GAME MODAL */}
      {isEditingModalOpen && editingGame && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsEditingModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in zoom-in-95 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-stone-900 to-amber-950 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-black text-lg">
                  {editingGame.title ? `Edit: ${editingGame.title}` : 'Create New Game'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Title & Tagline */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Game Title *
                  </label>
                  <input
                    id="admin-game-form-title"
                    type="text"
                    required
                    value={editingGame.title || ''}
                    onChange={(e) => setEditingGame((g) => ({ ...g, title: e.target.value }))}
                    placeholder="e.g., The Secret Scent Garden"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Catchy Tagline
                  </label>
                  <input
                    id="admin-game-form-tagline"
                    type="text"
                    value={editingGame.tagline || ''}
                    onChange={(e) => setEditingGame((g) => ({ ...g, tagline: e.target.value }))}
                    placeholder="e.g., An engaging outdoor treasure puzzle for high-energy explorers!"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Core Classification */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Category
                  </label>
                  <select
                    id="admin-game-form-cat"
                    value={editingGame.category || 'curiosity'}
                    onChange={(e) => setEditingGame((g) => ({ ...g, category: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Energy Level
                  </label>
                  <select
                    id="admin-game-form-energy"
                    value={editingGame.energyLevel || 'medium'}
                    onChange={(e) => setEditingGame((g) => ({ ...g, energyLevel: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 capitalize"
                  >
                    {ENERGY_LEVELS.map((el) => (
                      <option key={el} value={el}>
                        {el} energy
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    id="admin-game-form-duration"
                    type="number"
                    min={1}
                    max={60}
                    value={editingGame.durationMinutes || 10}
                    onChange={(e) => setEditingGame((g) => ({ ...g, durationMinutes: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800"
                  />
                </div>
              </div>

              {/* Illustration and Environment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Animated Character Illustration
                  </label>
                  <select
                    id="admin-game-form-illustration"
                    value={editingGame.illustrationKey || 'box_sniff'}
                    onChange={(e) => setEditingGame((g) => ({ ...g, illustrationKey: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800"
                  >
                    {ILLUSTRATION_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Environment
                  </label>
                  <select
                    id="admin-game-form-env"
                    value={editingGame.environment || 'indoor'}
                    onChange={(e) => setEditingGame((g) => ({ ...g, environment: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 capitalize"
                  >
                    {ENVIRONMENTS.map((env) => (
                      <option key={env} value={env}>
                        {env}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Non-Food Alternative & Tip */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Non-Food Friendly Alternative *
                  </label>
                  <input
                    id="admin-game-form-nonfood"
                    type="text"
                    required
                    value={editingGame.nonFoodAlternative || ''}
                    onChange={(e) => setEditingGame((g) => ({ ...g, nonFoodAlternative: e.target.value }))}
                    placeholder="e.g. Squeaky ball reward, quick tug burst, or affectionate praise"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Bond Building Tip
                  </label>
                  <input
                    id="admin-game-form-bondtip"
                    type="text"
                    value={editingGame.bondTip || ''}
                    onChange={(e) => setEditingGame((g) => ({ ...g, bondTip: e.target.value }))}
                    placeholder="e.g. Keep your tone cheerful and cheer for every small effort!"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800"
                  />
                </div>
              </div>

              {/* Materials & Skills Text Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Required Materials (one per line)
                  </label>
                  <textarea
                    id="admin-game-form-materials"
                    rows={3}
                    value={materialsText}
                    onChange={(e) => setMaterialsText(e.target.value)}
                    placeholder="Cardboard box&#10;Tennis ball&#10;Blanket"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 resize-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Skills Built (comma separated)
                  </label>
                  <textarea
                    id="admin-game-form-skills"
                    rows={3}
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    placeholder="Olfactory Focus, Bravery, Impulse Control"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 resize-none"
                  />
                </div>
              </div>

              {/* Game Steps Section */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Step-by-Step Instructions ({steps.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {steps.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-800">
                          Step {idx + 1}
                        </span>
                        {steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(idx)}
                            className="text-stone-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Step Title (e.g., Set the Stage)"
                        value={step.title}
                        onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-bold text-stone-900"
                      />

                      <textarea
                        rows={2}
                        placeholder="Step instructions for the dog parent..."
                        value={step.instruction}
                        onChange={(e) => handleStepChange(idx, 'instruction', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-700 resize-none"
                      />

                      <input
                        type="text"
                        placeholder="Optional Pro Tip..."
                        value={step.proTip || ''}
                        onChange={(e) => handleStepChange(idx, 'proTip', e.target.value)}
                        className="w-full px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-[11px] text-stone-500 italic"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-6 pt-3 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingGame.isArchived}
                    onChange={(e) => setEditingGame((g) => ({ ...g, isArchived: e.target.checked }))}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
                  />
                  <span className="text-xs font-bold text-stone-700">Hide / Archive Game</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingGame.isSecret}
                    onChange={(e) => setEditingGame((g) => ({ ...g, isSecret: e.target.checked }))}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
                  />
                  <span className="text-xs font-bold text-stone-700">Secret Bonus Game (Unlockable)</span>
                </label>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  id="admin-save-game-submit-btn"
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? (
                    <span>Saving to Cloud...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Game to Catalog</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
