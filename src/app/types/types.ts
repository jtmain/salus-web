// 1. Root-level interface for the entire JSON
export interface Root {
    acne_information: AcneInformation;
  }
  
  // 2. Main object containing diagnosis, causes, treatments, etc.
  export interface AcneInformation {
    diagnosis: Diagnosis;
    causes: string[];
    treatments: Treatment[];
    routine: Routine;
    routine_chart: RoutineChart;
  }
  
  // 3. Diagnosis object
  export interface Diagnosis {
    main_diagnosis: string;
    description: string;
  }
  
  // 4. Treatment items
  export interface Treatment {
    solution: string;
    details: string;
  }
  
  // 5. The routine object, which has multiple arrays of routine steps
  export interface Routine {
    cleansing: RoutineStep[];
    exfoliation: RoutineStep[];
    hydration: RoutineStep[];
    moisturization: RoutineStep[];
    treatment: RoutineStep[];
    prescription_options: RoutineStep[];
    incompatibilities: string[];
  }
  
  // 6. Each routine step has a product and a benefit
  export interface RoutineStep {
    product: string;
    benefit: string;
  }
  
  // 7. Routine chart showing morning and night products
  export interface RoutineChart {
    morning: string[];
    night: string[];
  }
  