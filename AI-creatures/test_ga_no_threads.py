# If you on a Windows machine with any Python version 
# or an M1 mac with any Python version
# or an Intel Mac with Python > 3.7
# the multi-threaded version does not work
# so instead, you can use this version. 

import unittest
import population
import simulation 
import genome 
import creature 
import numpy as np

class TestGA(unittest.TestCase):
    def testBasicGA(self):
        #sim = simulation.ThreadedSim(pool_size=1)
        sim = simulation.Simulation()
        
        for run in range(3):
            for popsize in [16, 64, 256]:
                mut1 = 0.01
                mut2 = 0.025
                pop = population.Population(pop_size=popsize, 
                                            gene_count=3)
                elite_fit = 0
                for iteration in range(int(16384 / popsize)):
                    # this is a non-threaded version 
                    # where we just call run_creature instead
                    # of eval_population
                    for cr in pop.creatures:
                        sim.run_creature(cr, 2400)            
                    #sim.eval_population(pop, 2400)
                    fits = [cr.get_distance_travelled() 
                            for cr in pop.creatures]
                    links = [len(cr.get_expanded_links()) 
                            for cr in pop.creatures]
                    print(iteration, "fittest:", np.round(np.max(fits), 3), 
                        "mean:", np.round(np.mean(fits), 3), "mean links", np.round(np.mean(links)), "max links", np.round(np.max(links)))       
                    fit_map = population.Population.get_fitness_map(fits)
                    new_creatures = []
                    for i in range(len(pop.creatures)):
                        p1_ind = population.Population.select_parent(fit_map)
                        p2_ind = population.Population.select_parent(fit_map)
                        p1 = pop.creatures[p1_ind]
                        p2 = pop.creatures[p2_ind]
                        # now we have the parents!
                        dna = genome.Genome.crossover(p1.dna, p2.dna)
                        dna = genome.Genome.point_mutate(dna, rate=mut1, amount=0.25)
                        dna = genome.Genome.shrink_mutate(dna, rate=mut2)
                        dna = genome.Genome.grow_mutate(dna, rate=mut1)
                        cr = creature.Creature(1)
                        cr.update_dna(dna)
                        new_creatures.append(cr)
                    # elitism
                    max_fit = np.max(fits)
                    for cr in pop.creatures:
                        if cr.get_distance_travelled() == max_fit:
                            new_cr = creature.Creature(1)
                            new_cr.update_dna(cr.dna)
                            new_creatures[0] = new_cr
                            if max_fit > elite_fit:
                                filename = "elite_mut"+str(mut1)+"_popsize"+str(popsize)+"_r"+str(run)+"_i"+str(iteration)+"_f"+str(max_fit)+".csv"
                                genome.Genome.to_csv(cr.dna, filename)
                                elite_fit = max_fit
                            break
                    
                    pop.creatures = new_creatures

                filename = "fitstats_mutrate"+str(mut1)+"_popsize"+str(popsize)+"_run"+str(run)+".txt"
                statdump_str = "fittest: "+str(np.round(np.max(fits), 3))
                statdump_str = statdump_str + ", mean: "+str(np.round(np.mean(fits), 3))
                statdump_str = statdump_str + ", mean links: "+str(np.round(np.mean(links)))
                statdump_str = statdump_str + ", max links: "+str(np.round(np.max(links)))
                with open(filename, 'w') as filnam:
                    filnam.write(statdump_str)

                mut1 = 0.02
                mut2 = 0.05
                pop = population.Population(pop_size=popsize, 
                                            gene_count=3)
                elite_fit = 0
                for iteration in range(int(16384 / popsize)):
                    # this is a non-threaded version 
                    # where we just call run_creature instead
                    # of eval_population
                    for cr in pop.creatures:
                        sim.run_creature(cr, 2400)            
                    #sim.eval_population(pop, 2400)
                    fits = [cr.get_distance_travelled() 
                            for cr in pop.creatures]
                    links = [len(cr.get_expanded_links()) 
                            for cr in pop.creatures]
                    print(iteration, "fittest:", np.round(np.max(fits), 3), 
                        "mean:", np.round(np.mean(fits), 3), "mean links", np.round(np.mean(links)), "max links", np.round(np.max(links)))       
                    fit_map = population.Population.get_fitness_map(fits)
                    new_creatures = []
                    for i in range(len(pop.creatures)):
                        p1_ind = population.Population.select_parent(fit_map)
                        p2_ind = population.Population.select_parent(fit_map)
                        p1 = pop.creatures[p1_ind]
                        p2 = pop.creatures[p2_ind]
                        # now we have the parents!
                        dna = genome.Genome.crossover(p1.dna, p2.dna)
                        dna = genome.Genome.point_mutate(dna, rate=mut1, amount=0.25)
                        dna = genome.Genome.shrink_mutate(dna, rate=mut2)
                        dna = genome.Genome.grow_mutate(dna, rate=mut1)
                        cr = creature.Creature(1)
                        cr.update_dna(dna)
                        new_creatures.append(cr)
                    # elitism
                    max_fit = np.max(fits)
                    for cr in pop.creatures:
                        if cr.get_distance_travelled() == max_fit:
                            new_cr = creature.Creature(1)
                            new_cr.update_dna(cr.dna)
                            new_creatures[0] = new_cr
                            if max_fit > elite_fit:
                                filename = "elite_mut"+str(mut1)+"_popsize"+str(popsize)+"_r"+str(run)+"_i"+str(iteration)+"_f"+str(max_fit)+".csv"
                                genome.Genome.to_csv(cr.dna, filename)
                                elite_fit = max_fit
                            break
                    
                    pop.creatures = new_creatures

                filename = "fitstats_mutrate"+str(mut1)+"_popsize"+str(popsize)+"_run"+str(run)+".txt"
                statdump_str = "fittest: "+str(np.round(np.max(fits), 3))
                statdump_str = statdump_str + ", mean: "+str(np.round(np.mean(fits), 3))
                statdump_str = statdump_str + ", mean links: "+str(np.round(np.mean(links)))
                statdump_str = statdump_str + ", max links: "+str(np.round(np.max(links)))
                with open(filename, 'w') as filnam:
                    filnam.write(statdump_str)

                mut1 = 0.05
                mut2 = 0.125
                pop = population.Population(pop_size=popsize, 
                                            gene_count=3)
                elite_fit = 0
                for iteration in range(int(16384 / popsize)):
                    # this is a non-threaded version 
                    # where we just call run_creature instead
                    # of eval_population
                    for cr in pop.creatures:
                        sim.run_creature(cr, 2400)            
                    #sim.eval_population(pop, 2400)
                    fits = [cr.get_distance_travelled() 
                            for cr in pop.creatures]
                    links = [len(cr.get_expanded_links()) 
                            for cr in pop.creatures]
                    print(iteration, "fittest:", np.round(np.max(fits), 3), 
                        "mean:", np.round(np.mean(fits), 3), "mean links", np.round(np.mean(links)), "max links", np.round(np.max(links)))       
                    fit_map = population.Population.get_fitness_map(fits)
                    new_creatures = []
                    for i in range(len(pop.creatures)):
                        p1_ind = population.Population.select_parent(fit_map)
                        p2_ind = population.Population.select_parent(fit_map)
                        p1 = pop.creatures[p1_ind]
                        p2 = pop.creatures[p2_ind]
                        # now we have the parents!
                        dna = genome.Genome.crossover(p1.dna, p2.dna)
                        dna = genome.Genome.point_mutate(dna, rate=mut1, amount=0.25)
                        dna = genome.Genome.shrink_mutate(dna, rate=mut2)
                        dna = genome.Genome.grow_mutate(dna, rate=mut1)
                        cr = creature.Creature(1)
                        cr.update_dna(dna)
                        new_creatures.append(cr)
                    # elitism
                    max_fit = np.max(fits)
                    for cr in pop.creatures:
                        if cr.get_distance_travelled() == max_fit:
                            new_cr = creature.Creature(1)
                            new_cr.update_dna(cr.dna)
                            new_creatures[0] = new_cr
                            if max_fit > elite_fit:
                                filename = "elite_mut"+str(mut1)+"_popsize"+str(popsize)+"_r"+str(run)+"_i"+str(iteration)+"_f"+str(max_fit)+".csv"
                                genome.Genome.to_csv(cr.dna, filename)
                                elite_fit = max_fit
                            break
                    
                    pop.creatures = new_creatures

                filename = "fitstats_mutrate"+str(mut1)+"_popsize"+str(popsize)+"_run"+str(run)+".txt"
                statdump_str = "fittest: "+str(np.round(np.max(fits), 3))
                statdump_str = statdump_str + ", mean: "+str(np.round(np.mean(fits), 3))
                statdump_str = statdump_str + ", mean links: "+str(np.round(np.mean(links)))
                statdump_str = statdump_str + ", max links: "+str(np.round(np.max(links)))
                with open(filename, 'w') as filnam:
                    filnam.write(statdump_str)

                mut1 = 0.1
                mut2 = 0.25
                pop = population.Population(pop_size=popsize, 
                                            gene_count=3)
                elite_fit = 0
                for iteration in range(int(16384 / popsize)):
                    # this is a non-threaded version 
                    # where we just call run_creature instead
                    # of eval_population
                    for cr in pop.creatures:
                        sim.run_creature(cr, 2400)            
                    #sim.eval_population(pop, 2400)
                    fits = [cr.get_distance_travelled() 
                            for cr in pop.creatures]
                    links = [len(cr.get_expanded_links()) 
                            for cr in pop.creatures]
                    print(iteration, "fittest:", np.round(np.max(fits), 3), 
                        "mean:", np.round(np.mean(fits), 3), "mean links", np.round(np.mean(links)), "max links", np.round(np.max(links)))       
                    fit_map = population.Population.get_fitness_map(fits)
                    new_creatures = []
                    for i in range(len(pop.creatures)):
                        p1_ind = population.Population.select_parent(fit_map)
                        p2_ind = population.Population.select_parent(fit_map)
                        p1 = pop.creatures[p1_ind]
                        p2 = pop.creatures[p2_ind]
                        # now we have the parents!
                        dna = genome.Genome.crossover(p1.dna, p2.dna)
                        dna = genome.Genome.point_mutate(dna, rate=mut1, amount=0.25)
                        dna = genome.Genome.shrink_mutate(dna, rate=mut2)
                        dna = genome.Genome.grow_mutate(dna, rate=mut1)
                        cr = creature.Creature(1)
                        cr.update_dna(dna)
                        new_creatures.append(cr)
                    # elitism
                    max_fit = np.max(fits)
                    for cr in pop.creatures:
                        if cr.get_distance_travelled() == max_fit:
                            new_cr = creature.Creature(1)
                            new_cr.update_dna(cr.dna)
                            new_creatures[0] = new_cr
                            if max_fit > elite_fit:
                                filename = "elite_mut"+str(mut1)+"_popsize"+str(popsize)+"_r"+str(run)+"_i"+str(iteration)+"_f"+str(max_fit)+".csv"
                                genome.Genome.to_csv(cr.dna, filename)
                                elite_fit = max_fit
                            break
                    
                    pop.creatures = new_creatures

                filename = "fitstats_mutrate"+str(mut1)+"_popsize"+str(popsize)+"_run"+str(run)+".txt"
                statdump_str = "fittest: "+str(np.round(np.max(fits), 3))
                statdump_str = statdump_str + ", mean: "+str(np.round(np.mean(fits), 3))
                statdump_str = statdump_str + ", mean links: "+str(np.round(np.mean(links)))
                statdump_str = statdump_str + ", max links: "+str(np.round(np.max(links)))
                with open(filename, 'w') as filnam:
                    filnam.write(statdump_str)

                mut1 = 0.15
                mut2 = 0.35
                pop = population.Population(pop_size=popsize, 
                                            gene_count=3)
                elite_fit = 0
                for iteration in range(int(16384 / popsize)):
                    # this is a non-threaded version 
                    # where we just call run_creature instead
                    # of eval_population
                    for cr in pop.creatures:
                        sim.run_creature(cr, 2400)            
                    #sim.eval_population(pop, 2400)
                    fits = [cr.get_distance_travelled() 
                            for cr in pop.creatures]
                    links = [len(cr.get_expanded_links()) 
                            for cr in pop.creatures]
                    print(iteration, "fittest:", np.round(np.max(fits), 3), 
                        "mean:", np.round(np.mean(fits), 3), "mean links", np.round(np.mean(links)), "max links", np.round(np.max(links)))       
                    fit_map = population.Population.get_fitness_map(fits)
                    new_creatures = []
                    for i in range(len(pop.creatures)):
                        p1_ind = population.Population.select_parent(fit_map)
                        p2_ind = population.Population.select_parent(fit_map)
                        p1 = pop.creatures[p1_ind]
                        p2 = pop.creatures[p2_ind]
                        # now we have the parents!
                        dna = genome.Genome.crossover(p1.dna, p2.dna)
                        dna = genome.Genome.point_mutate(dna, rate=mut1, amount=0.25)
                        dna = genome.Genome.shrink_mutate(dna, rate=mut2)
                        dna = genome.Genome.grow_mutate(dna, rate=mut1)
                        cr = creature.Creature(1)
                        cr.update_dna(dna)
                        new_creatures.append(cr)
                    # elitism
                    max_fit = np.max(fits)
                    for cr in pop.creatures:
                        if cr.get_distance_travelled() == max_fit:
                            new_cr = creature.Creature(1)
                            new_cr.update_dna(cr.dna)
                            new_creatures[0] = new_cr
                            if max_fit > elite_fit:
                                filename = "elite_mut"+str(mut1)+"_popsize"+str(popsize)+"_r"+str(run)+"_i"+str(iteration)+"_f"+str(max_fit)+".csv"
                                genome.Genome.to_csv(cr.dna, filename)
                                elite_fit = max_fit
                            break
                    
                    pop.creatures = new_creatures

                filename = "fitstats_mutrate"+str(mut1)+"_popsize"+str(popsize)+"_run"+str(run)+".txt"
                statdump_str = "fittest: "+str(np.round(np.max(fits), 3))
                statdump_str = statdump_str + ", mean: "+str(np.round(np.mean(fits), 3))
                statdump_str = statdump_str + ", mean links: "+str(np.round(np.mean(links)))
                statdump_str = statdump_str + ", max links: "+str(np.round(np.max(links)))
                with open(filename, 'w') as filnam:
                    filnam.write(statdump_str)

                mut1 = 0.2
                mut2 = 0.5
                pop = population.Population(pop_size=popsize, 
                                            gene_count=3)
                elite_fit = 0
                for iteration in range(int(16384 / popsize)):
                    # this is a non-threaded version 
                    # where we just call run_creature instead
                    # of eval_population
                    for cr in pop.creatures:
                        sim.run_creature(cr, 2400)            
                    #sim.eval_population(pop, 2400)
                    fits = [cr.get_distance_travelled() 
                            for cr in pop.creatures]
                    links = [len(cr.get_expanded_links()) 
                            for cr in pop.creatures]
                    print(iteration, "fittest:", np.round(np.max(fits), 3), 
                        "mean:", np.round(np.mean(fits), 3), "mean links", np.round(np.mean(links)), "max links", np.round(np.max(links)))       
                    fit_map = population.Population.get_fitness_map(fits)
                    new_creatures = []
                    for i in range(len(pop.creatures)):
                        p1_ind = population.Population.select_parent(fit_map)
                        p2_ind = population.Population.select_parent(fit_map)
                        p1 = pop.creatures[p1_ind]
                        p2 = pop.creatures[p2_ind]
                        # now we have the parents!
                        dna = genome.Genome.crossover(p1.dna, p2.dna)
                        dna = genome.Genome.point_mutate(dna, rate=mut1, amount=0.25)
                        dna = genome.Genome.shrink_mutate(dna, rate=mut2)
                        dna = genome.Genome.grow_mutate(dna, rate=mut1)
                        cr = creature.Creature(1)
                        cr.update_dna(dna)
                        new_creatures.append(cr)
                    # elitism
                    max_fit = np.max(fits)
                    for cr in pop.creatures:
                        if cr.get_distance_travelled() == max_fit:
                            new_cr = creature.Creature(1)
                            new_cr.update_dna(cr.dna)
                            new_creatures[0] = new_cr
                            if max_fit > elite_fit:
                                filename = "elite_mut"+str(mut1)+"_popsize"+str(popsize)+"_r"+str(run)+"_i"+str(iteration)+"_f"+str(max_fit)+".csv"
                                genome.Genome.to_csv(cr.dna, filename)
                                elite_fit = max_fit
                            break
                    
                    pop.creatures = new_creatures

                filename = "fitstats_mutrate"+str(mut1)+"_popsize"+str(popsize)+"_run"+str(run)+".txt"
                statdump_str = "fittest: "+str(np.round(np.max(fits), 3))
                statdump_str = statdump_str + ", mean: "+str(np.round(np.mean(fits), 3))
                statdump_str = statdump_str + ", mean links: "+str(np.round(np.mean(links)))
                statdump_str = statdump_str + ", max links: "+str(np.round(np.max(links)))
                with open(filename, 'w') as filnam:
                    filnam.write(statdump_str)

                mut1 = 0.25
                mut2 = 0.6
                pop = population.Population(pop_size=popsize, 
                                            gene_count=3)
                elite_fit = 0
                for iteration in range(int(16384 / popsize)):
                    # this is a non-threaded version 
                    # where we just call run_creature instead
                    # of eval_population
                    for cr in pop.creatures:
                        sim.run_creature(cr, 2400)            
                    #sim.eval_population(pop, 2400)
                    fits = [cr.get_distance_travelled() 
                            for cr in pop.creatures]
                    links = [len(cr.get_expanded_links()) 
                            for cr in pop.creatures]
                    print(iteration, "fittest:", np.round(np.max(fits), 3), 
                        "mean:", np.round(np.mean(fits), 3), "mean links", np.round(np.mean(links)), "max links", np.round(np.max(links)))       
                    fit_map = population.Population.get_fitness_map(fits)
                    new_creatures = []
                    for i in range(len(pop.creatures)):
                        p1_ind = population.Population.select_parent(fit_map)
                        p2_ind = population.Population.select_parent(fit_map)
                        p1 = pop.creatures[p1_ind]
                        p2 = pop.creatures[p2_ind]
                        # now we have the parents!
                        dna = genome.Genome.crossover(p1.dna, p2.dna)
                        dna = genome.Genome.point_mutate(dna, rate=mut1, amount=0.25)
                        dna = genome.Genome.shrink_mutate(dna, rate=mut2)
                        dna = genome.Genome.grow_mutate(dna, rate=mut1)
                        cr = creature.Creature(1)
                        cr.update_dna(dna)
                        new_creatures.append(cr)
                    # elitism
                    max_fit = np.max(fits)
                    for cr in pop.creatures:
                        if cr.get_distance_travelled() == max_fit:
                            new_cr = creature.Creature(1)
                            new_cr.update_dna(cr.dna)
                            new_creatures[0] = new_cr
                            if max_fit > elite_fit:
                                filename = "elite_mut"+str(mut1)+"_popsize"+str(popsize)+"_r"+str(run)+"_i"+str(iteration)+"_f"+str(max_fit)+".csv"
                                genome.Genome.to_csv(cr.dna, filename)
                                elite_fit = max_fit
                            break
                    
                    pop.creatures = new_creatures

                filename = "fitstats_mutrate"+str(mut1)+"_popsize"+str(popsize)+"_run"+str(run)+".txt"
                statdump_str = "fittest: "+str(np.round(np.max(fits), 3))
                statdump_str = statdump_str + ", mean: "+str(np.round(np.mean(fits), 3))
                statdump_str = statdump_str + ", mean links: "+str(np.round(np.mean(links)))
                statdump_str = statdump_str + ", max links: "+str(np.round(np.max(links)))
                with open(filename, 'w') as filnam:
                    filnam.write(statdump_str)

                mut1 = 0.33
                mut2 = 0.8
                pop = population.Population(pop_size=popsize, 
                                            gene_count=3)
                elite_fit = 0
                for iteration in range(int(16384 / popsize)):
                    # this is a non-threaded version 
                    # where we just call run_creature instead
                    # of eval_population
                    for cr in pop.creatures:
                        sim.run_creature(cr, 2400)            
                    #sim.eval_population(pop, 2400)
                    fits = [cr.get_distance_travelled() 
                            for cr in pop.creatures]
                    links = [len(cr.get_expanded_links()) 
                            for cr in pop.creatures]
                    print(iteration, "fittest:", np.round(np.max(fits), 3), 
                        "mean:", np.round(np.mean(fits), 3), "mean links", np.round(np.mean(links)), "max links", np.round(np.max(links)))       
                    fit_map = population.Population.get_fitness_map(fits)
                    new_creatures = []
                    for i in range(len(pop.creatures)):
                        p1_ind = population.Population.select_parent(fit_map)
                        p2_ind = population.Population.select_parent(fit_map)
                        p1 = pop.creatures[p1_ind]
                        p2 = pop.creatures[p2_ind]
                        # now we have the parents!
                        dna = genome.Genome.crossover(p1.dna, p2.dna)
                        dna = genome.Genome.point_mutate(dna, rate=mut1, amount=0.25)
                        dna = genome.Genome.shrink_mutate(dna, rate=mut2)
                        dna = genome.Genome.grow_mutate(dna, rate=mut1)
                        cr = creature.Creature(1)
                        cr.update_dna(dna)
                        new_creatures.append(cr)
                    # elitism
                    max_fit = np.max(fits)
                    for cr in pop.creatures:
                        if cr.get_distance_travelled() == max_fit:
                            new_cr = creature.Creature(1)
                            new_cr.update_dna(cr.dna)
                            new_creatures[0] = new_cr
                            if max_fit > elite_fit:
                                filename = "elite_mut"+str(mut1)+"_popsize"+str(popsize)+"_r"+str(run)+"_i"+str(iteration)+"_f"+str(max_fit)+".csv"
                                genome.Genome.to_csv(cr.dna, filename)
                                elite_fit = max_fit
                            break
                    
                    pop.creatures = new_creatures

                filename = "fitstats_mutrate"+str(mut1)+"_popsize"+str(popsize)+"_run"+str(run)+".txt"
                statdump_str = "fittest: "+str(np.round(np.max(fits), 3))
                statdump_str = statdump_str + ", mean: "+str(np.round(np.mean(fits), 3))
                statdump_str = statdump_str + ", mean links: "+str(np.round(np.mean(links)))
                statdump_str = statdump_str + ", max links: "+str(np.round(np.max(links)))
                with open(filename, 'w') as filnam:
                    filnam.write(statdump_str)

                mut1 = 0.4
                mut2 = 0.9
                pop = population.Population(pop_size=popsize, 
                                            gene_count=3)
                elite_fit = 0
                for iteration in range(int(16384 / popsize)):
                    # this is a non-threaded version 
                    # where we just call run_creature instead
                    # of eval_population
                    for cr in pop.creatures:
                        sim.run_creature(cr, 2400)            
                    #sim.eval_population(pop, 2400)
                    fits = [cr.get_distance_travelled() 
                            for cr in pop.creatures]
                    links = [len(cr.get_expanded_links()) 
                            for cr in pop.creatures]
                    print(iteration, "fittest:", np.round(np.max(fits), 3), 
                        "mean:", np.round(np.mean(fits), 3), "mean links", np.round(np.mean(links)), "max links", np.round(np.max(links)))       
                    fit_map = population.Population.get_fitness_map(fits)
                    new_creatures = []
                    for i in range(len(pop.creatures)):
                        p1_ind = population.Population.select_parent(fit_map)
                        p2_ind = population.Population.select_parent(fit_map)
                        p1 = pop.creatures[p1_ind]
                        p2 = pop.creatures[p2_ind]
                        # now we have the parents!
                        dna = genome.Genome.crossover(p1.dna, p2.dna)
                        dna = genome.Genome.point_mutate(dna, rate=mut1, amount=0.25)
                        dna = genome.Genome.shrink_mutate(dna, rate=mut2)
                        dna = genome.Genome.grow_mutate(dna, rate=mut1)
                        cr = creature.Creature(1)
                        cr.update_dna(dna)
                        new_creatures.append(cr)
                    # elitism
                    max_fit = np.max(fits)
                    for cr in pop.creatures:
                        if cr.get_distance_travelled() == max_fit:
                            new_cr = creature.Creature(1)
                            new_cr.update_dna(cr.dna)
                            new_creatures[0] = new_cr
                            if max_fit > elite_fit:
                                filename = "elite_mut"+str(mut1)+"_popsize"+str(popsize)+"_r"+str(run)+"_i"+str(iteration)+"_f"+str(max_fit)+".csv"
                                genome.Genome.to_csv(cr.dna, filename)
                                elite_fit = max_fit
                            break
                    
                    pop.creatures = new_creatures

                filename = "fitstats_mutrate"+str(mut1)+"_popsize"+str(popsize)+"_run"+str(run)+".txt"
                statdump_str = "fittest: "+str(np.round(np.max(fits), 3))
                statdump_str = statdump_str + ", mean: "+str(np.round(np.mean(fits), 3))
                statdump_str = statdump_str + ", mean links: "+str(np.round(np.mean(links)))
                statdump_str = statdump_str + ", max links: "+str(np.round(np.max(links)))
                with open(filename, 'w') as filnam:
                    filnam.write(statdump_str)

                mut1 = 0.5
                mut2 = 0.95
                pop = population.Population(pop_size=popsize, 
                                            gene_count=3)
                elite_fit = 0
                for iteration in range(int(16384 / popsize)):
                    # this is a non-threaded version 
                    # where we just call run_creature instead
                    # of eval_population
                    for cr in pop.creatures:
                        sim.run_creature(cr, 2400)            
                    #sim.eval_population(pop, 2400)
                    fits = [cr.get_distance_travelled() 
                            for cr in pop.creatures]
                    links = [len(cr.get_expanded_links()) 
                            for cr in pop.creatures]
                    print(iteration, "fittest:", np.round(np.max(fits), 3), 
                        "mean:", np.round(np.mean(fits), 3), "mean links", np.round(np.mean(links)), "max links", np.round(np.max(links)))       
                    fit_map = population.Population.get_fitness_map(fits)
                    new_creatures = []
                    for i in range(len(pop.creatures)):
                        p1_ind = population.Population.select_parent(fit_map)
                        p2_ind = population.Population.select_parent(fit_map)
                        p1 = pop.creatures[p1_ind]
                        p2 = pop.creatures[p2_ind]
                        # now we have the parents!
                        dna = genome.Genome.crossover(p1.dna, p2.dna)
                        dna = genome.Genome.point_mutate(dna, rate=mut1, amount=0.25)
                        dna = genome.Genome.shrink_mutate(dna, rate=mut2)
                        dna = genome.Genome.grow_mutate(dna, rate=mut1)
                        cr = creature.Creature(1)
                        cr.update_dna(dna)
                        new_creatures.append(cr)
                    # elitism
                    max_fit = np.max(fits)
                    for cr in pop.creatures:
                        if cr.get_distance_travelled() == max_fit:
                            new_cr = creature.Creature(1)
                            new_cr.update_dna(cr.dna)
                            new_creatures[0] = new_cr
                            if max_fit > elite_fit:
                                filename = "elite_mut"+str(mut1)+"_popsize"+str(popsize)+"_r"+str(run)+"_i"+str(iteration)+"_f"+str(max_fit)+".csv"
                                genome.Genome.to_csv(cr.dna, filename)
                                elite_fit = max_fit
                            break
                    
                    pop.creatures = new_creatures

                filename = "fitstats_mutrate"+str(mut1)+"_popsize"+str(popsize)+"_run"+str(run)+".txt"
                statdump_str = "fittest: "+str(np.round(np.max(fits), 3))
                statdump_str = statdump_str + ", mean: "+str(np.round(np.mean(fits), 3))
                statdump_str = statdump_str + ", mean links: "+str(np.round(np.mean(links)))
                statdump_str = statdump_str + ", max links: "+str(np.round(np.max(links)))
                with open(filename, 'w') as filnam:
                    filnam.write(statdump_str)

                mut1 = 0.67
                mut2 = 0.97
                pop = population.Population(pop_size=popsize, 
                                            gene_count=3)
                elite_fit = 0
                for iteration in range(int(16384 / popsize)):
                    # this is a non-threaded version 
                    # where we just call run_creature instead
                    # of eval_population
                    for cr in pop.creatures:
                        sim.run_creature(cr, 2400)            
                    #sim.eval_population(pop, 2400)
                    fits = [cr.get_distance_travelled() 
                            for cr in pop.creatures]
                    links = [len(cr.get_expanded_links()) 
                            for cr in pop.creatures]
                    print(iteration, "fittest:", np.round(np.max(fits), 3), 
                        "mean:", np.round(np.mean(fits), 3), "mean links", np.round(np.mean(links)), "max links", np.round(np.max(links)))       
                    fit_map = population.Population.get_fitness_map(fits)
                    new_creatures = []
                    for i in range(len(pop.creatures)):
                        p1_ind = population.Population.select_parent(fit_map)
                        p2_ind = population.Population.select_parent(fit_map)
                        p1 = pop.creatures[p1_ind]
                        p2 = pop.creatures[p2_ind]
                        # now we have the parents!
                        dna = genome.Genome.crossover(p1.dna, p2.dna)
                        dna = genome.Genome.point_mutate(dna, rate=mut1, amount=0.25)
                        dna = genome.Genome.shrink_mutate(dna, rate=mut2)
                        dna = genome.Genome.grow_mutate(dna, rate=mut1)
                        cr = creature.Creature(1)
                        cr.update_dna(dna)
                        new_creatures.append(cr)
                    # elitism
                    max_fit = np.max(fits)
                    for cr in pop.creatures:
                        if cr.get_distance_travelled() == max_fit:
                            new_cr = creature.Creature(1)
                            new_cr.update_dna(cr.dna)
                            new_creatures[0] = new_cr
                            if max_fit > elite_fit:
                                filename = "elite_mut"+str(mut1)+"_popsize"+str(popsize)+"_r"+str(run)+"_i"+str(iteration)+"_f"+str(max_fit)+".csv"
                                genome.Genome.to_csv(cr.dna, filename)
                                elite_fit = max_fit
                            break
                    
                    pop.creatures = new_creatures

                filename = "fitstats_mutrate"+str(mut1)+"_popsize"+str(popsize)+"_run"+str(run)+".txt"
                statdump_str = "fittest: "+str(np.round(np.max(fits), 3))
                statdump_str = statdump_str + ", mean: "+str(np.round(np.mean(fits), 3))
                statdump_str = statdump_str + ", mean links: "+str(np.round(np.mean(links)))
                statdump_str = statdump_str + ", max links: "+str(np.round(np.max(links)))
                with open(filename, 'w') as filnam:
                    filnam.write(statdump_str)

                mut1 = 0.75
                mut2 = 0.98
                pop = population.Population(pop_size=popsize, 
                                            gene_count=3)
                elite_fit = 0
                for iteration in range(int(16384 / popsize)):
                    # this is a non-threaded version 
                    # where we just call run_creature instead
                    # of eval_population
                    for cr in pop.creatures:
                        sim.run_creature(cr, 2400)            
                    #sim.eval_population(pop, 2400)
                    fits = [cr.get_distance_travelled() 
                            for cr in pop.creatures]
                    links = [len(cr.get_expanded_links()) 
                            for cr in pop.creatures]
                    print(iteration, "fittest:", np.round(np.max(fits), 3), 
                        "mean:", np.round(np.mean(fits), 3), "mean links", np.round(np.mean(links)), "max links", np.round(np.max(links)))       
                    fit_map = population.Population.get_fitness_map(fits)
                    new_creatures = []
                    for i in range(len(pop.creatures)):
                        p1_ind = population.Population.select_parent(fit_map)
                        p2_ind = population.Population.select_parent(fit_map)
                        p1 = pop.creatures[p1_ind]
                        p2 = pop.creatures[p2_ind]
                        # now we have the parents!
                        dna = genome.Genome.crossover(p1.dna, p2.dna)
                        dna = genome.Genome.point_mutate(dna, rate=mut1, amount=0.25)
                        dna = genome.Genome.shrink_mutate(dna, rate=mut2)
                        dna = genome.Genome.grow_mutate(dna, rate=mut1)
                        cr = creature.Creature(1)
                        cr.update_dna(dna)
                        new_creatures.append(cr)
                    # elitism
                    max_fit = np.max(fits)
                    for cr in pop.creatures:
                        if cr.get_distance_travelled() == max_fit:
                            new_cr = creature.Creature(1)
                            new_cr.update_dna(cr.dna)
                            new_creatures[0] = new_cr
                            if max_fit > elite_fit:
                                filename = "elite_mut"+str(mut1)+"_popsize"+str(popsize)+"_r"+str(run)+"_i"+str(iteration)+"_f"+str(max_fit)+".csv"
                                genome.Genome.to_csv(cr.dna, filename)
                                elite_fit = max_fit
                            break
                    
                    pop.creatures = new_creatures

                filename = "fitstats_mutrate"+str(mut1)+"_popsize"+str(popsize)+"_run"+str(run)+".txt"
                statdump_str = "fittest: "+str(np.round(np.max(fits), 3))
                statdump_str = statdump_str + ", mean: "+str(np.round(np.mean(fits), 3))
                statdump_str = statdump_str + ", mean links: "+str(np.round(np.mean(links)))
                statdump_str = statdump_str + ", max links: "+str(np.round(np.max(links)))
                with open(filename, 'w') as filnam:
                    filnam.write(statdump_str)

                mut1 = 0.9
                mut2 = 0.99
                pop = population.Population(pop_size=popsize, 
                                            gene_count=3)
                elite_fit = 0
                for iteration in range(int(16384 / popsize)):
                    # this is a non-threaded version 
                    # where we just call run_creature instead
                    # of eval_population
                    for cr in pop.creatures:
                        sim.run_creature(cr, 2400)            
                    #sim.eval_population(pop, 2400)
                    fits = [cr.get_distance_travelled() 
                            for cr in pop.creatures]
                    links = [len(cr.get_expanded_links()) 
                            for cr in pop.creatures]
                    print(iteration, "fittest:", np.round(np.max(fits), 3), 
                        "mean:", np.round(np.mean(fits), 3), "mean links", np.round(np.mean(links)), "max links", np.round(np.max(links)))       
                    fit_map = population.Population.get_fitness_map(fits)
                    new_creatures = []
                    for i in range(len(pop.creatures)):
                        p1_ind = population.Population.select_parent(fit_map)
                        p2_ind = population.Population.select_parent(fit_map)
                        p1 = pop.creatures[p1_ind]
                        p2 = pop.creatures[p2_ind]
                        # now we have the parents!
                        dna = genome.Genome.crossover(p1.dna, p2.dna)
                        dna = genome.Genome.point_mutate(dna, rate=mut1, amount=0.25)
                        dna = genome.Genome.shrink_mutate(dna, rate=mut2)
                        dna = genome.Genome.grow_mutate(dna, rate=mut1)
                        cr = creature.Creature(1)
                        cr.update_dna(dna)
                        new_creatures.append(cr)
                    # elitism
                    max_fit = np.max(fits)
                    for cr in pop.creatures:
                        if cr.get_distance_travelled() == max_fit:
                            new_cr = creature.Creature(1)
                            new_cr.update_dna(cr.dna)
                            new_creatures[0] = new_cr
                            if max_fit > elite_fit:
                                filename = "elite_mut"+str(mut1)+"_popsize"+str(popsize)+"_r"+str(run)+"_i"+str(iteration)+"_f"+str(max_fit)+".csv"
                                genome.Genome.to_csv(cr.dna, filename)
                                elite_fit = max_fit
                            break
                    
                    pop.creatures = new_creatures

                filename = "fitstats_mutrate"+str(mut1)+"_popsize"+str(popsize)+"_run"+str(run)+".txt"
                statdump_str = "fittest: "+str(np.round(np.max(fits), 3))
                statdump_str = statdump_str + ", mean: "+str(np.round(np.mean(fits), 3))
                statdump_str = statdump_str + ", mean links: "+str(np.round(np.mean(links)))
                statdump_str = statdump_str + ", max links: "+str(np.round(np.max(links)))
                with open(filename, 'w') as filnam:
                    filnam.write(statdump_str)

                mut1 = 1.0
                mut2 = 1.0
                pop = population.Population(pop_size=popsize, 
                                            gene_count=3)
                elite_fit = 0
                for iteration in range(int(16384 / popsize)):
                    # this is a non-threaded version 
                    # where we just call run_creature instead
                    # of eval_population
                    for cr in pop.creatures:
                        sim.run_creature(cr, 2400)            
                    #sim.eval_population(pop, 2400)
                    fits = [cr.get_distance_travelled() 
                            for cr in pop.creatures]
                    links = [len(cr.get_expanded_links()) 
                            for cr in pop.creatures]
                    print(iteration, "fittest:", np.round(np.max(fits), 3), 
                        "mean:", np.round(np.mean(fits), 3), "mean links", np.round(np.mean(links)), "max links", np.round(np.max(links)))       
                    fit_map = population.Population.get_fitness_map(fits)
                    new_creatures = []
                    for i in range(len(pop.creatures)):
                        p1_ind = population.Population.select_parent(fit_map)
                        p2_ind = population.Population.select_parent(fit_map)
                        p1 = pop.creatures[p1_ind]
                        p2 = pop.creatures[p2_ind]
                        # now we have the parents!
                        dna = genome.Genome.crossover(p1.dna, p2.dna)
                        dna = genome.Genome.point_mutate(dna, rate=mut1, amount=0.25)
                        dna = genome.Genome.shrink_mutate(dna, rate=mut2)
                        dna = genome.Genome.grow_mutate(dna, rate=mut1)
                        cr = creature.Creature(1)
                        cr.update_dna(dna)
                        new_creatures.append(cr)
                    # elitism
                    max_fit = np.max(fits)
                    for cr in pop.creatures:
                        if cr.get_distance_travelled() == max_fit:
                            new_cr = creature.Creature(1)
                            new_cr.update_dna(cr.dna)
                            new_creatures[0] = new_cr
                            if max_fit > elite_fit:
                                filename = "elite_mut"+str(mut1)+"_popsize"+str(popsize)+"_r"+str(run)+"_i"+str(iteration)+"_f"+str(max_fit)+".csv"
                                genome.Genome.to_csv(cr.dna, filename)
                                elite_fit = max_fit
                            break
                    
                    pop.creatures = new_creatures

                filename = "fitstats_mutrate"+str(mut1)+"_popsize"+str(popsize)+"_run"+str(run)+".txt"
                statdump_str = "fittest: "+str(np.round(np.max(fits), 3))
                statdump_str = statdump_str + ", mean: "+str(np.round(np.mean(fits), 3))
                statdump_str = statdump_str + ", mean links: "+str(np.round(np.mean(links)))
                statdump_str = statdump_str + ", max links: "+str(np.round(np.max(links)))
                with open(filename, 'w') as filnam:
                    filnam.write(statdump_str)

        self.assertNotEqual(fits[0], 0)

unittest.main()
