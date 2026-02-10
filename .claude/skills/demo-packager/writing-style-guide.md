# Writing Style Guide for Deliverable Documentation

## Target Voice
Direct, specific, occasionally informal. Model: AWS Well-Architected Framework documentation.

## Rules

### Sentence Structure
- Mix sentence lengths: 8-25 words per sentence
- Never start more than 2 consecutive paragraphs the same way
- Favor active voice: "The system processes requests" not "Requests are processed by the system"
- Use "we" for team actions, "the system" for technical descriptions

### Word Choice
- Replace every AI-typical word with a specific alternative:
  | Instead of | Use |
  |-----------|-----|
  | leverage | use |
  | utilize | use |
  | robust | strong, reliable, tested |
  | seamless | smooth, straightforward |
  | comprehensive | complete, thorough, full |
  | streamline | simplify, reduce steps |
  | facilitate | help, enable, support |
  | enhance | improve, strengthen |
  | ensure | verify, confirm, check |
  | innovative | new, novel, modern |
  | cutting-edge | current, modern |
  | state-of-the-art | modern, current |
  | holistic | complete, full |
  | empower | enable, allow |
  | delve | explore, examine, look at |
  | paradigm | model, approach, pattern |
  | synergy | collaboration, combined effort |
  | best-in-class | leading, top-performing |
  | game-changer | improvement, advance |

### Paragraph Structure
- Open with the key point, not a meta-reference
- Bad: "This section describes the authentication approach."
- Good: "Users authenticate with a password before accessing the dashboard."
- Include specific numbers, versions, and names
- End paragraphs with implications or next steps, not summaries

### Transitions
- Avoid: Additionally, Furthermore, Moreover, It's worth noting, Notably
- Use instead: natural logical flow, or no transition at all
- Starting a new paragraph is itself a transition

### Honesty
- State limitations directly: "The current implementation does not support..."
- Acknowledge trade-offs: "We chose SQLite for simplicity, accepting that it limits concurrent write performance."
- Do not oversell: describe what the system does, not what it could theoretically do

### Formatting
- Use tables for structured data (comparisons, configurations, specs)
- Use prose for explanations and reasoning
- Use code blocks for commands, configs, and examples
- Use bullet lists sparingly -- prefer prose paragraphs

### Em Dashes
- Use at most 1-2 per document
- Prefer commas, parentheses, or separate sentences
